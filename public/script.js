// Escucho el click del botón para buscar clima y sugerencias
document.getElementById("getWeatherBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
  }
});

// Función para obtener el clima actual desde el backend
function getWeather(city) {
  const url = `/api/weather?city=${encodeURIComponent(city)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod === 200) {
        // Extraigo datos importantes
        const temp = data.main.temp;
        const weather = data.weather[0].main.toLowerCase();
        const icon = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        // Escribo el clima en pantalla
        document.getElementById("weatherResult").innerHTML = `
          <h2 class="city">${city}</h2>
          <p class="tiempo">${data.weather[0].description}, ${temp}°C</p>
          <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
        `;

        // Llamo a la función que recomienda lugares
        getSuggestions(city, weather);
      } else {
        document.getElementById("weatherResult").innerHTML = "Ciudad no encontrada.";
        document.getElementById("suggestions").innerHTML = "";
      }
    })
    .catch(err => {
      console.error("Error al obtener clima:", err);
      document.getElementById("weatherResult").innerHTML = "Error al obtener el clima.";
      document.getElementById("suggestions").innerHTML = "";
    });
}

// Función para obtener lugares turísticos desde el backend
function getSuggestions(city, weatherCondition) {
  const category = (weatherCondition.includes("lluvia") || weatherCondition.includes("nieve"))
    ? "13018" // Museos
    : "16000"; // Atracciones turísticas

  const url = `/api/places?city=${encodeURIComponent(city)}&category=${category}`;

  fetch(url)
    .then(res => res.json())
    .then(async data => {
      const results = data.results;
      const container = document.getElementById("suggestions");
      container.innerHTML = "";

      for (const place of results) {
        const name = place.name;
        const address = place.location.formatted_address || "Dirección no disponible";
        let image = "https://via.placeholder.com/300x200?text=Sin+foto";

        // Obtener foto del lugar desde el backend
        try {
          const photoRes = await fetch(`/api/photos?fsq_id=${place.fsq_id}`);
          const photos = await photoRes.json();
          if (photos.length > 0) {
            image = photos[0].prefix + "original" + photos[0].suffix;
          }
        } catch (e) {
          // Si falla, se queda la imagen por defecto
        }

        // Construir URL a Google Maps
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + city)}`;

        // Construir URL a Foursquare (opcional, si quieres enlazar a la ficha pública)
        // const foursquareUrl = `https://foursquare.com/v/${place.fsq_id}`;

        const card = `
          <div class="col-md-4">
            <div class="place-card">
              <h5>${name}</h5>
              <p>${address}</p>
              <img src="${image}" alt="${name}" class="img-fluid">
              <p><a href="${mapsUrl}" target="_blank" rel="noopener">Ver en Google Maps</a></p>
            </div>
          </div>
        `;
        container.innerHTML += card;
      }
    })
    .catch(err => {
      console.error("Error al obtener lugares:", err);
      document.getElementById("suggestions").innerHTML = "<p>Error al cargar sugerencias.</p>";
    });
}