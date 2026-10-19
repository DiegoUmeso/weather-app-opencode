// js/api.js — funciones para hablar con las APIs de Open-Meteo.
// Se cargan antes que app.js, que es quien las usa.

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Busca una ciudad por nombre y devuelve la primera coincidencia.
// Devuelve null si no hay coincidencias.
// Lanza un error si la red falla o si la API responde con un error HTTP.
async function buscarCiudad(nombre) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(nombre)}&count=1&language=es&format=json`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("La API de búsqueda respondió con un error.");
  }

  const datos = await respuesta.json();
  const resultados = datos.results;

  // La API omite "results" cuando no encuentra ninguna coincidencia.
  if (!resultados || resultados.length === 0) {
    return null;
  }

  const ciudad = resultados[0];

  return {
    name: ciudad.name,
    country: ciudad.country,
    region: ciudad.admin1 || null,
    latitude: ciudad.latitude,
    longitude: ciudad.longitude,
    timezone: ciudad.timezone,
  };
}

// Traduce los códigos WMO que devuelve la API a una descripción en español.
// Tabla tomada de la documentación oficial de Open-Meteo.
const DESCRIPCIONES_TIEMPO = {
  0: "Cielo despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada intensa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia helada ligera",
  67: "Lluvia helada intensa",
  71: "Nevada ligera",
  73: "Nevada moderada",
  75: "Nevada intensa",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos violentos",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve intensos",
  95: "Tormenta",
  96: "Tormenta con granizo ligero",
  97: "Tormenta intensa",
  99: "Tormenta con granizo intenso",
};

function describirCodigo(codigo) {
  return DESCRIPCIONES_TIEMPO[codigo] || "Condición desconocida";
}

// Consulta el clima actual de unas coordenadas.
// Lanza un error si la red falla o si la API responde con un error HTTP.
async function obtenerClima(latitud, longitud) {
  const url =
    `${FORECAST_URL}?latitude=${latitud}&longitude=${longitud}` +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code" +
    "&timezone=auto";

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("La API del clima respondió con un error.");
  }

  const datos = await respuesta.json();
  const actual = datos.current;

  return {
    temperature: actual.temperature_2m,
    apparentTemperature: actual.apparent_temperature,
    weatherCode: actual.weather_code,
    weatherCondition: describirCodigo(actual.weather_code),
    windSpeed: actual.wind_speed_10m,
    humidity: actual.relative_humidity_2m,
  };
}
