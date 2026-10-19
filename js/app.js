// js/app.js — lógica de la interfaz: eventos, estado y dibujado en pantalla.

const form = document.getElementById("form-busqueda");
const input = document.getElementById("input-ciudad");
const mensaje = document.getElementById("mensaje");

const climaActual = document.getElementById("clima-actual");
const ciudadNombre = document.getElementById("ciudad-nombre");
const ciudadCondicion = document.getElementById("ciudad-condicion");
const datoTemperatura = document.getElementById("dato-temperatura");
const datoSensacion = document.getElementById("dato-sensacion");
const datoViento = document.getElementById("dato-viento");
const datoHumedad = document.getElementById("dato-humedad");

// Longitud mínima: la API no devuelve nada para vacío ni para 1 carácter.
const MINIMO_CARACTERES = 2;

// Muestra un texto en la zona de mensajes.
function mostrarMensaje(texto) {
  mensaje.textContent = texto;
}

// Rellena la tarjeta del clima actual.
function mostrarClimaActual(ciudad, clima) {
  ciudadNombre.textContent = `${ciudad.name}, ${ciudad.country}`;
  ciudadCondicion.textContent = clima.weatherCondition;
  datoTemperatura.textContent = `${clima.temperature} °C`;
  datoSensacion.textContent = `${clima.apparentTemperature} °C`;
  datoViento.textContent = `${clima.windSpeed} km/h`;
  datoHumedad.textContent = `${clima.humidity} %`;
  climaActual.hidden = false;
}

// Se ejecuta al enviar el formulario.
async function alBuscar(evento) {
  evento.preventDefault();
  const texto = input.value.trim();

  // Ocultamos el resultado anterior en cuanto empieza una búsqueda nueva.
  climaActual.hidden = true;

  if (texto.length < MINIMO_CARACTERES) {
    mostrarMensaje(`Escribe al menos ${MINIMO_CARACTERES} caracteres para buscar.`);
    return;
  }

  mostrarMensaje("Buscando...");

  try {
    const ciudad = await buscarCiudad(texto);

    if (ciudad === null) {
      mostrarMensaje("No encontramos esa ciudad. Prueba con otro nombre.");
      return;
    }

    mostrarMensaje(`${ciudad.name}, ${ciudad.country} — ${ciudad.latitude}, ${ciudad.longitude}`);

    const clima = await obtenerClima(ciudad.latitude, ciudad.longitude);
    mostrarClimaActual(ciudad, clima);
  } catch (error) {
    mostrarMensaje("No se pudo obtener el clima. Revisa tu conexión e inténtalo de nuevo.");
  }
}

form.addEventListener("submit", alBuscar);
