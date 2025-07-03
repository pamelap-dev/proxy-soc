export default async function handler(req, res) {
  const { endpoint, ...restQuery } = req.query;

  const url = `https://cotizador.socasesores.com/apipro/${endpoint ?? ''}`;

  const response = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
  });

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(text);
  }
}
