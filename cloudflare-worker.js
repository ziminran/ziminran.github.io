const DEFAULT_ALLOWED_ORIGIN = 'https://ziminran.github.io';
const DASHSCOPE_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const MAX_INPUT_CHARS = 4000;
const MAX_TOKENS = 800;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

const rateLimitState = new Map(); // ⚠️仅用于示例，冷启动/实例切换会重置，TODO：生产必须使用Cloudflare Rate Limiting或Durable Objects

function getCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function getAllowedOrigin(env) {
  return env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
}

function isAllowedOrigin(origin, allowedOrigin) {
  return origin === allowedOrigin;
}

function isRateLimited(ip) {
  const now = Date.now();
  let entry = rateLimitState.get(ip);
  if (!entry || now - entry.start >= RATE_LIMIT_WINDOW_MS) {
    entry = { start: now, count: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    rateLimitState.set(ip, entry);
    return true;
  }
  entry.count += 1;
  rateLimitState.set(ip, entry);
  return false;
}

function normalizeMessages(messages) {
  return messages
    .filter((message) => message && typeof message.content === 'string')
    .map((message) => ({
      role: ['system', 'user', 'assistant'].includes(message.role) ? message.role : 'user',
      content: message.content
    }));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    const allowedOrigin = getAllowedOrigin(env);

    if (request.method === 'OPTIONS') {
      if (!isAllowedOrigin(origin, allowedOrigin)) {
        return new Response('Forbidden', { status: 403 });
      }
      return new Response(null, { status: 204, headers: getCorsHeaders(allowedOrigin) });
    }

    if (request.method !== 'POST') {
      return new Response('Not Found', { status: 404 });
    }

    if (!isAllowedOrigin(origin, allowedOrigin)) {
      return new Response('Forbidden', { status: 403 });
    }

    if (!env.DASHSCOPE_API_KEY) {
      return new Response(JSON.stringify({ error: { message: 'Missing DASHSCOPE_API_KEY.' } }), {
        status: 500,
        headers: { ...getCorsHeaders(allowedOrigin), 'Content-Type': 'application/json' }
      });
    }

    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(clientIp)) {
      return new Response(JSON.stringify({ error: { message: 'Rate limit exceeded.' } }), {
        status: 429,
        headers: { ...getCorsHeaders(allowedOrigin), 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: { message: 'Invalid request body.' } }), {
        status: 400,
        headers: { ...getCorsHeaders(allowedOrigin), 'Content-Type': 'application/json' }
      });
    }

    const messages = normalizeMessages(body.messages);
    const totalLength = messages.reduce((sum, message) => sum + message.content.length, 0);
    if (totalLength > MAX_INPUT_CHARS) {
      return new Response(JSON.stringify({ error: { message: 'Input too long.' } }), {
        status: 413,
        headers: { ...getCorsHeaders(allowedOrigin), 'Content-Type': 'application/json' }
      });
    }

    const requestedTokens = Number(body.max_tokens);
    const maxTokens = Number.isFinite(requestedTokens)
      ? Math.min(Math.max(requestedTokens, 1), MAX_TOKENS)
      : MAX_TOKENS;
    const temperature = Number.isFinite(Number(body.temperature))
      ? Number(body.temperature)
      : undefined;
    const topP = Number.isFinite(Number(body.top_p))
      ? Number(body.top_p)
      : undefined;

    const payload = {
      model: 'qwen-plus',
      messages,
      max_tokens: maxTokens,
      ...(temperature !== undefined ? { temperature } : {}),
      ...(topP !== undefined ? { top_p: topP } : {})
    };

    const upstreamResponse = await fetch(DASHSCOPE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DASHSCOPE_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const responseText = await upstreamResponse.text();
    return new Response(responseText, {
      status: upstreamResponse.status,
      headers: { ...getCorsHeaders(allowedOrigin), 'Content-Type': 'application/json' }
    });
  }
};
