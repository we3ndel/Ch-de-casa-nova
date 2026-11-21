const { hasBackend, pipeline, isAdmin, UNIT_RE, readBody } = require("../lib/store");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!isAdmin(req)) return res.status(401).json({ error: "Senha incorreta" });
  if (!hasBackend()) return res.status(503).json({ error: "Banco de dados não configurado" });
  const { action, unit, data } = readBody(req);
  try {
    if (action === "release") {
      if (typeof unit !== "string" || !UNIT_RE.test(unit)) return res.status(400).json({ error: "Item inválido" });
      await pipeline([["HDEL", "reservas", unit]]);
      return res.status(200).json({ ok: true });
    }
    if (action === "evento") {
      const ev = {};
      for (const k of ["data", "hora", "local", "whatsapp"]) ev[k] = String((data || {})[k] || "").trim().slice(0, 120);
      await pipeline([["SET", "evento", JSON.stringify(ev)]]);
      return res.status(200).json({ ok: true });
    }
    res.status(400).json({ error: "Ação desconhecida" });
  } catch (e) {
    res.status(500).json({ error: "Falha" });
  }
};
