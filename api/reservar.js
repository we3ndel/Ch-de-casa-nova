const { hasBackend, pipeline, UNIT_RE, readBody } = require("../lib/store");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!hasBackend()) return res.status(503).json({ error: "Banco de dados não configurado" });
  const { units, nome, item } = readBody(req);
  const name = String(nome || "").trim().slice(0, 60);
  if (!name) return res.status(400).json({ error: "Nome obrigatório" });
  if (!Array.isArray(units) || !units.length || units.length > 10 || !units.every((u) => typeof u === "string" && UNIT_RE.test(u)))
    return res.status(400).json({ error: "Itens inválidos" });
  const val = JSON.stringify({ nome: name, item: String(item || "").slice(0, 40), at: Date.now() });
  try {
    // HSETNX: só grava se ninguém escolheu a unidade antes (evita duplicidade).
    const out = await pipeline(units.map((u) => ["HSETNX", "reservas", u, val]));
    res.status(200).json({ ok: units.filter((_, i) => out[i] === 1) });
  } catch (e) {
    res.status(500).json({ error: "Falha ao reservar" });
  }
};
