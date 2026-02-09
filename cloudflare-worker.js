// Default allowlist origin; override via ALLOWED_ORIGIN env for other deployments.
const DEFAULT_ALLOWED_ORIGIN = 'https://ziminran.github.io';
const DEFAULT_MODEL = 'qwen-plus';
// DashScope OpenAI-compatible endpoint.
const DASH_SCOPE_ENDPOINT =
  'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const MAX_INPUT_CHARS = 4000;
const MAX_TOKENS_LIMIT = 800;
const DEFAULT_MAX_TOKENS = 500;

// Simple per-isolate limiter; does not apply across regions/isolates.
const rateLimitStore = new Map();
const MAX_RATE_LIMIT_ENTRIES = 1000;

function cleanupRateLimitStore(now) {
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(ip);
    }
  }
}

function withCors(origin, headers = {}) {
  return {
    ...headers,
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function getClientIp(request) {
  const cfConnectingIp = request.headers.get('CF-Connecting-IP');
  if (cfConnectingIp) return cfConnectingIp;
  const forwardedFor = request.headers.get('X-Forwarded-For');
  return forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
}

function isRateLimited(ip, now) {
  const entry = rateLimitStore.get(ip);
  if (rateLimitStore.size > MAX_RATE_LIMIT_ENTRIES) {
    cleanupRateLimitStore(now);
  }
  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  entry.count += 1;
  return false;
}

function totalMessageLength(messages) {
  return messages.reduce((total, message) => {
    if (!message || typeof message.content !== 'string') {
      return total;
    }
    return total + message.content.length;
  }, 0);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowedOrigin = env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
    const corsHeaders = withCors(allowedOrigin, { 'Content-Type': 'application/json' });

    if (origin !== allowedOrigin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden origin.', code: 'FORBIDDEN_ORIGIN' }),
        { status: 403, headers: corsHeaders }
      );
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed.', code: 'METHOD_NOT_ALLOWED' }),
        { status: 405, headers: corsHeaders }
      );
    }

    const now = Date.now();
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp, now)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please slow down.', code: 'RATE_LIMITED' }),
        { status: 429, headers: corsHeaders }
      );
    }

    if (!env.DASHSCOPE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Server configuration missing.', code: 'SERVER_CONFIG' }),
        { status: 500, headers: corsHeaders }
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body.', code: 'INVALID_JSON' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required.', code: 'MISSING_MESSAGES' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const totalLength = totalMessageLength(messages);
    if (totalLength > MAX_INPUT_CHARS) {
      return new Response(
        JSON.stringify({ error: 'Input is too long.', code: 'INPUT_TOO_LONG' }),
        { status: 413, headers: corsHeaders }
      );
    }

    const requestedMaxTokens = Number(payload.max_tokens);
    const maxTokens = Number.isFinite(requestedMaxTokens)
      ? Math.min(requestedMaxTokens, MAX_TOKENS_LIMIT)
      : DEFAULT_MAX_TOKENS;

    const temperature = Number(payload.temperature);
    const safeTemperature =
      Number.isFinite(temperature) && temperature >= 0 && temperature <= 2
        ? temperature
        : 0.8;

    const dashscopePayload = {
      model: env.DASHSCOPE_MODEL || DEFAULT_MODEL, // Falls back to DEFAULT_MODEL if DASHSCOPE_MODEL is not set.
      messages,
      max_tokens: maxTokens,
      temperature: safeTemperature,
      stream: false
    };

    let dashscopeResponse;
    try {
      dashscopeResponse = await fetch(DASH_SCOPE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.DASHSCOPE_API_KEY}`
        },
        body: JSON.stringify(dashscopePayload)
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Upstream request failed.', code: 'UPSTREAM_UNAVAILABLE' }),
        { status: 502, headers: corsHeaders }
      );
    }

    const responseText = await dashscopeResponse.text();
    if (!dashscopeResponse.ok) {
      return new Response(
        JSON.stringify({
          error: 'Upstream error.',
          code: 'UPSTREAM_ERROR',
          status: dashscopeResponse.status,
          details: responseText
        }),
        { status: 502, headers: corsHeaders }
      );
    }

    return new Response(responseText, { status: 200, headers: corsHeaders });
  }
};
