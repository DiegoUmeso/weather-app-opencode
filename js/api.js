// js/api.js — funciones para hablar con las APIs de Open-Meteo.
// Se cargan antes que app.js, que es quien las usa.

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// Busca una ciudad por nombre y devuelve la primera coincidencia.
// Lanza un error si la red falla o si la API responde con un error HTTP.
async function buscarCiudad(nombre) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(nombre)}&count=1&language=es&format=json`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("La API de búsqueda respondió con un error.");
  }

  const datos = await respuesta.json();
  const ciudad = datos.results[0];

  return {
    name: ciudad.name,
    country: ciudad.country,
    region: ciudad.admin1 || null,
    latitude: ciudad.latitude,
    longitude: ciudad.longitude,
    timezone: ciudad.timezone,
  };
}
