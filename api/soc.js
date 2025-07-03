export default async function handler(req, res) {
  // Habilita CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejo de preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Llama al endpoint original de SOC
    const response = await fetch("https://cotizador.socasesores.com/apipro/", {
      method: req.method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();

    if (!text) {
      console.error("❌ Respuesta vacía desde SOC");
      return res.status(502).json({ error: "Respuesta vacía desde SOC" });
    }

    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch (e) {
      console.warn("⚠️ La respuesta no es JSON, devolviendo texto plano.");
      return res.status(200).send(text);
    }

  } catch (err) {
    console.error("🔴 Error desde proxy:", err);
    return res.status(500).json({ error: "Error desde el proxy" });
  }
}

