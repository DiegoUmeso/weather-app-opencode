// js/app.js — lógica de la interfaz: eventos, estado y dibujado en pantalla.

const form = document.getElementById("form-busqueda");
const input = document.getElementById("input-ciudad");
const mensaje = document.getElementById("mensaje");

// Longitud mínima: la API no devuelve nada para vacío ni para 1 carácter.
const MINIMO_CARACTERES = 2;

// Muestra un texto en la zona de mensajes.
function mostrarMensaje(texto) {
  mensaje.textContent = texto;
}

// Se ejecuta al enviar el formulario.
async function alBuscar(evento) {
  evento.preventDefault();
  const texto = input.value.trim();

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
  } catch (error) {
    mostrarMensaje("No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
  }
}

form.addEventListener("submit", alBuscar);
