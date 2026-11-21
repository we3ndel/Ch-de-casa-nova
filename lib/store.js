// Armazenamento em Redis (Upstash) via REST, sem dependências.
// Na Vercel: Storage → adicionar "Upstash for Redis" ao projeto, que cria
// KV_REST_API_URL e KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_URL/TOKEN).
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const hasBackend = () => Boolean(URL_ && TOKEN);

async function pipeline(cmds) {
  const r = await fetch(URL_.replace(/\/$/, "") + "/pipeline", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error("redis " + r.status);
  const out = await r.json();
  return out.map((x) => {
    if (x.error) throw new Error(x.error);
    return x.result;
  });
}

const isAdmin = (req) => {
  const pass = process.env.ADMIN_PASSWORD;
  return Boolean(pass) && req.headers["x-admin-key"] === pass;
};

const UNIT_RE = /^[a-z0-9-]{1,40}$/;

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body || "{}"); } catch { return {}; }
}

module.exports = { hasBackend, pipeline, isAdmin, UNIT_RE, readBody };
