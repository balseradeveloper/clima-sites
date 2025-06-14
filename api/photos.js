import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { fsq_id } = req.query;
  const apiKey = process.env.FOURSQUARE_API_KEY;
  if (!fsq_id) return res.status(400).json({ error: "Falta el parámetro fsq_id" });

  const url = `https://api.foursquare.com/v3/places/${fsq_id}/photos?limit=1`;
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: apiKey
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al consultar Foursquare Photos" });
  }
}