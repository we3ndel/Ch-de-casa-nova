const { hasBackend, pipeline, isAdmin } = require("../lib/store");

module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  const admin = isAdmin(req);
  if (!hasBackend()) return res.status(200).json({ backend: false, admin, reservas: {}, evento: {} });
  try {
    const [flat, evRaw] = await pipeline([["HGETALL", "reservas"], ["GET", "evento"]]);
    const reservas = {};
    for (let i = 0; i < (flat || []).length; i += 2) {
      let v; try { v = JSON.parse(flat[i + 1]); } catch { continue; }
      // Convidados só veem que está escolhido; nomes só para o anfitrião.
      reservas[flat[i]] = admin ? { nome: v.nome, at: v.at } : { nome: "", at: v.at };
    }
    let evento = {}; try { evento = JSON.parse(evRaw || "{}") || {}; } catch {}
    res.status(200).json({ backend: true, admin, reservas, evento });
  } catch (e) {
    res.status(500).json({ error: "Falha ao ler a lista" });
  }
};
