// Campaign Forge proxy — Cloudflare Worker
// Holds the Anthropic API key as a secret so the public page never sees it.
// Callers must send the shared passphrase in the `x-forge-pass` header.
//
// Required secrets (Worker → Settings → Variables and Secrets):
//   ANTHROPIC_API_KEY   your sk-ant-... key
//   FORGE_PASSPHRASE    the passphrase you give your players
// Optional plain variable:
//   ALLOWED_ORIGINS     comma-separated origins (default: the GitHub Pages site + localhost)

const DEFAULT_ORIGINS = [
  'https://coppolajonathan-lab.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000'
];
const ALLOWED_MODELS = new Set(['claude-sonnet-5-5', 'claude-opus-5-5', 'claude-haiku-5-5']);
const MAX_TOKENS = 4096;
const MAX_BODY_BYTES = 200_000;   // ~ a long campaign conversation
const MAX_MESSAGES = 60;

function cors(origin, allowed) {
  const ok = allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-forge-pass',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(status, obj, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'content-type': 'application/json' } });
}

// Constant-time string compare so the passphrase can't be guessed by timing.
function safeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(a || ''), y = enc.encode(b || '');
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const origins = allowed.length ? allowed : DEFAULT_ORIGINS;
    const origin = request.headers.get('Origin') || '';
    const h = cors(origin, origins);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/v1/messages') return json(404, { error: { message: 'Not found' } }, h);
    if (!origins.includes(origin)) return json(403, { error: { message: 'Origin not allowed' } }, h);
    if (!env.ANTHROPIC_API_KEY || !env.FORGE_PASSPHRASE) return json(500, { error: { message: 'Proxy is missing its secrets' } }, h);
    if (!safeEqual(request.headers.get('x-forge-pass'), env.FORGE_PASSPHRASE)) return json(401, { error: { message: 'Wrong passphrase' } }, h);

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json(413, { error: { message: 'Conversation too long — start a new campaign' } }, h);
    let body;
    try { body = JSON.parse(raw); } catch { return json(400, { error: { message: 'Bad JSON' } }, h); }
    if (!ALLOWED_MODELS.has(body.model)) return json(400, { error: { message: 'Model not allowed' } }, h);
    if (!Array.isArray(body.messages) || body.messages.length > MAX_MESSAGES) return json(400, { error: { message: 'Too many messages — start a new campaign' } }, h);

    // Only forward the fields Campaign Forge uses, with a hard token cap.
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: body.model,
        max_tokens: Math.min(Number(body.max_tokens) || MAX_TOKENS, MAX_TOKENS),
        stream: body.stream === true,
        system: typeof body.system === 'string' ? body.system.slice(0, 20_000) : undefined,
        messages: body.messages
      })
    });

    const out = new Headers(h);
    out.set('content-type', upstream.headers.get('content-type') || 'application/json');
    out.set('cache-control', 'no-store');
    return new Response(upstream.body, { status: upstream.status, headers: out });
  }
};
