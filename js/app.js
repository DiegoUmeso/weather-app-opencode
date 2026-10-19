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

const pronostico = document.getElementById("pronostico");

const btnBuscar = document.getElementById("btn-buscar");
const btnReintentar = document.getElementById("btn-reintentar");

// Longitud mínima: la API no devuelve nada para vacío ni para 1 carácter.
const MINIMO_CARACTERES = 2;

// Última búsqueda válida: la usa el botón "Reintentar".
let ultimaBusqueda = "";

// Muestra un texto en la zona de mensajes.
function mostrarMensaje(texto) {
  mensaje.textContent = texto;
}

// Esconde los resultados anteriores (clima y pronóstico).
function ocultarResultados() {
  climaActual.hidden = true;
  pronostico.hidden = true;
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

// Convierte "2026-10-19" en un texto corto, p. ej. "lun, 19 oct".
function formatearFecha(iso) {
  const fecha = new Date(`${iso}T00:00:00`);
  return fecha.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Dibuja una tarjeta por día del pronóstico.
function mostrarPronostico(forecast) {
  pronostico.replaceChildren();

  for (const dia of forecast) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "dia";

    const fecha = document.createElement("h3");
    fecha.textContent = formatearFecha(dia.date);

    const condicion = document.createElement("p");
    condicion.className = "condicion";
    condicion.textContent = dia.weatherCondition;

    const temperaturas = document.createElement("p");
    temperaturas.className = "temps";
    temperaturas.textContent = `Máx ${dia.tempMax} °C / Mín ${dia.tempMin} °C`;

    tarjeta.append(fecha, condicion, temperaturas);
    pronostico.append(tarjeta);
  }

  pronostico.hidden = false;
}

// Muestra un error y ofrece volver a intentar.
function mostrarError(texto) {
  mostrarMensaje(texto);
  btnReintentar.hidden = false;
}

// Hace la búsqueda completa: ciudad y luego clima.
async function buscar(texto) {
  ultimaBusqueda = texto;

  ocultarResultados();
  btnReintentar.hidden = true;
  btnBuscar.disabled = true; // evita envíos repetidos mientras se espera
  mostrarMensaje("Buscando la ciudad...");

  try {
    const ciudad = await buscarCiudad(texto);

    if (ciudad === null) {
      mostrarError("No encontramos esa ciudad. Prueba con otro nombre.");
      return;
    }

    mostrarMensaje("Consultando el clima...");

    const { current, forecast } = await obtenerClima(ciudad.latitude, ciudad.longitude);

    mostrarMensaje(`${ciudad.name}, ${ciudad.country} — ${ciudad.latitude}, ${ciudad.longitude}`);
    mostrarClimaActual(ciudad, current);
    mostrarPronostico(forecast);
  } catch (error) {
    // Pase lo que pase (red o API), la interfaz vuelve a quedar usable.
    mostrarError("No se pudo obtener el clima. Revisa tu conexión e inténtalo de nuevo.");
  } finally {
    btnBuscar.disabled = false;
  }
}

// Se ejecuta al enviar el formulario.
function alBuscar(evento) {
  evento.preventDefault();
  const texto = input.value.trim();

  if (texto.length < MINIMO_CARACTERES) {
    ocultarResultados();
    btnReintentar.hidden = true;
    mostrarMensaje(`Escribe al menos ${MINIMO_CARACTERES} caracteres para buscar.`);
    return;
  }

  buscar(texto);
}

// El botón "Reintentar" repite la última búsqueda válida.
btnReintentar.addEventListener("click", () => buscar(ultimaBusqueda));

form.addEventListener("submit", alBuscar);
