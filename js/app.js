// js/app.js — lógica de la interfaz: eventos, estado y dibujado en pantalla.

const form = document.getElementById("form-busqueda");
const input = document.getElementById("input-ciudad");
const mensaje = document.getElementById("mensaje");

// Muestra un texto en la zona de mensajes.
function mostrarMensaje(texto) {
  mensaje.textContent = texto;
}

// Se ejecuta al enviar el formulario.
async function alBuscar(evento) {
  evento.preventDefault();
  const texto = input.value.trim();

  mostrarMensaje("Buscando...");

  try {
    const ciudad = await buscarCiudad(texto);
    mostrarMensaje(`${ciudad.name}, ${ciudad.country} — ${ciudad.latitude}, ${ciudad.longitude}`);
  } catch (error) {
    mostrarMensaje("No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.");
  }
}

form.addEventListener("submit", alBuscar);
