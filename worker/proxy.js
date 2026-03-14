/**
 * Strange Atlas — Kimi API Proxy
 * Cloudflare Worker that proxies chat requests to Moonshot's Kimi API.
 * Adds CORS headers, keeps the API key server-side, and rate-limits per IP.
 *
 * Deploy: npx wrangler deploy
 * Set secret: npx wrangler secret put KIMI_API_KEY
 */

const ALLOWED_ORIGINS = [
  'https://tqny.github.io',
  'http://localhost:8000',
  'http://localhost:3000',
  'http://localhost:8091',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:8091',
];

const KIMI_ENDPOINT = 'https://api.moonshot.ai/v1/chat/completions';

// Rate limiting: max requests per IP per window
const RATE_LIMIT = 60;           // requests
const RATE_WINDOW_MS = 3600000;  // 1 hour
const ipHits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    ipHits.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Rate limit by IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: { message: 'Rate limit exceeded. Try again later.' } }), {
        status: 429,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    if (!env.KIMI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured on proxy' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();

      // Enforce model and limits server-side to prevent abuse
      body.model = body.model || 'moonshot-v1-8k';
      body.max_tokens = Math.min(body.max_tokens || 512, 512);

      const res = await fetch(KIMI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.KIMI_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 502,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }
  },
};
