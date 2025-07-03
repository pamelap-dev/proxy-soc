export default async function handler(req, res) {
  // Configuración para CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extraer el endpoint desde el query param
  const { endpoint, ...restQuery } = req.query;
  const url = `https://cotizador.socasesores.com/apipro/${endpoint ?? ''}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch (e) {
      res.status(200).send(text);
    }
  } catch (err) {
    console.error("❌ Error al llamar a SOC:", err);
    res.status(500).json({ error: "Error desde el proxy a SOC" });
  }
}
