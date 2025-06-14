import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = 3000;

app.use(express.static('public')); // Sirve tu frontend

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "Falta el parámetro city" });
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=es`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al consultar OpenWeather" });
  }
});

app.get('/api/places', async (req, res) => {
  const { city, category } = req.query;
  const url = `https://api.foursquare.com/v3/places/search?near=${city}&categories=${category}&limit=6`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY
    }
  });
  const data = await response.json();
  res.json(data);
});

app.get('/api/photos', async (req, res) => {
  const { fsq_id } = req.query;
  const url = `https://api.foursquare.com/v3/places/${fsq_id}/photos?limit=1`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY
    }
  });
  const data = await response.json();
  res.json(data);
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));