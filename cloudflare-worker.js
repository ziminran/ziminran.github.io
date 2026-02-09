const ALLOWED_ORIGIN = 'https://ziminran.github.io';
const DASHSCOPE_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const MAX_INPUT_CHARS = 4000;
const MAX_TOKENS = 800;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

const rateLimitState = new Map();

function getCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function isAllowedOrigin(origin) {
  return origin === ALLOWED_ORIGIN;
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitState.get(ip);
  if (!entry || now - entry.start >= RATE_LIMIT_WINDOW_MS) {
    rateLimitState.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
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

    if (request.method === 'OPTIONS') {
      if (!isAllowedOrigin(origin)) {
        return new Response('Forbidden', { status: 403 });
      }
      return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return new Response('Not Found', { status: 404 });
    }

    if (!isAllowedOrigin(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    if (!env.DASHSCOPE_API_KEY) {
      return new Response(JSON.stringify({ error: { message: 'Missing DASHSCOPE_API_KEY.' } }), {
        status: 500,
        headers: { ...getCorsHeaders(origin), 'Content-Type': 'application/json' }
      });
    }

    const clientIp = request.headers.get('CF-Connecting-IP')
      || request.headers.get('X-Forwarded-For')
      || 'unknown';
    if (isRateLimited(clientIp)) {
      return new Response(JSON.stringify({ error: { message: 'Rate limit exceeded.' } }), {
        status: 429,
        headers: { ...getCorsHeaders(origin), 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: { message: 'Invalid request body.' } }), {
        status: 400,
        headers: { ...getCorsHeaders(origin), 'Content-Type': 'application/json' }
      });
    }

    const messages = normalizeMessages(body.messages);
    const totalLength = messages.reduce((sum, message) => sum + message.content.length, 0);
    if (totalLength > MAX_INPUT_CHARS) {
      return new Response(JSON.stringify({ error: { message: 'Input too long.' } }), {
        status: 413,
        headers: { ...getCorsHeaders(origin), 'Content-Type': 'application/json' }
      });
    }

    const requestedMaxTokens = Number(body.max_tokens);
    const maxTokens = Number.isFinite(requestedMaxTokens)
      ? Math.min(requestedMaxTokens, MAX_TOKENS)
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
      headers: { ...getCorsHeaders(origin), 'Content-Type': 'application/json' }
    });
  }
};
