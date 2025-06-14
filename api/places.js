export default async function handler(req, res) {
  const { city, category } = req.query;
  const apiKey = process.env.FOURSQUARE_API_KEY;
  if (!city || !category) return res.status(400).json({ error: "Faltan parámetros" });

  const url = `https://api.foursquare.com/v3/places/search?near=${encodeURIComponent(city)}&categories=${category}&limit=6`;
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
    res.status(500).json({ error: "Error al consultar Foursquare" });
  }
}