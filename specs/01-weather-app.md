# 01 — Weather App

## 1. Objetivo

Construir una aplicación web que permita buscar una ciudad y consultar su clima actual y el pronóstico de al menos tres días.

## 2. Alcance

**Incluye:**

- Buscar una ciudad mediante un campo de texto.
- Validar búsquedas vacías o de un solo carácter antes de consultar la API.
- Obtener sus coordenadas con la API Geocoding de Open-Meteo.
- Consultar el clima actual mediante la API Forecast.
- Mostrar temperatura, sensación térmica, condición del cielo, velocidad del viento y humedad.
- Mostrar el pronóstico de al menos tres días con temperatura máxima y mínima.
- Mostrar un estado de carga mientras se esperan las respuestas.
- Mostrar mensajes comprensibles si la ciudad no existe, si no hay resultados o si falla la conexión o la API.
- Tener una interfaz usable en teléfonos y computadoras.
- Ejecutarse localmente en el navegador.

**No incluye:**

- Base de datos.
- Claves de API.
- Inicio de sesión.
- Geolocalización automática.
- Mapas ni historial del clima.

## 3. Modelo de datos

Estructuras que necesita la aplicación, definidas como objetos en memoria. **No se crea ninguna base de datos**; estos datos solo viven durante la sesión del navegador.

Unidades para esta primera versión: **temperatura en grados Celsius (°C)**, **velocidad del viento en kilómetros por hora (km/h)** y **humedad en porcentaje (%)**.

- **Location** — la ciudad elegida:
  - `name`: `string` — nombre de la ciudad.
  - `country`: `string` — país.
  - `region`: `string | null` — región o provincia, si está disponible.
  - `latitude`: `number` — latitud en grados decimales.
  - `longitude`: `number` — longitud en grados decimales.
  - `timezone`: `string` — zona horaria de la ciudad (la devuelve Geocoding; se usa en los datos diarios).

- **CurrentWeather** — el clima de ahora:
  - `temperature`: `number` — temperatura en °C.
  - `apparentTemperature`: `number` — sensación térmica en °C.
  - `weatherCode`: `number` — código WMO que devuelve la API (p. ej. `0`, `3`, `61`).
  - `weatherCondition`: `string` — condición del cielo en texto, traducida desde `weatherCode` con una tabla propia.
  - `windSpeed`: `number` — velocidad del viento en km/h.
  - `humidity`: `number` — humedad en %.

- **DailyForecast** — un día del pronóstico:
  - `date`: `string` — fecha en formato `YYYY-MM-DD`.
  - `tempMin`: `number` — temperatura mínima en °C.
  - `tempMax`: `number` — temperatura máxima en °C.
  - `weatherCode`: `number` — código WMO del día (la API devuelve el más representativo).
  - `weatherCondition`: `string` — condición del cielo en texto, traducida desde `weatherCode`.

- **AppState** — el estado de la interfaz:
  - `searchText`: `string` — lo que el usuario escribió en el campo de búsqueda.
  - `isLoading`: `boolean` — `true` mientras se esperan respuestas.
  - `errorMessage`: `string | null` — mensaje de error a mostrar, o `null` si no hay error.
  - `location`: `Location | null` — ubicación seleccionada.
  - `currentWeather`: `CurrentWeather | null` — clima actual consultado.
  - `forecast`: `DailyForecast[]` — lista del pronóstico (longitud mínima de 3).

> **Parámetros confirmados** en la documentación oficial de Open-Meteo (Forecast y Geocoding). Los nombres de arriba son la estructura interna de la aplicación; el mapeo desde el JSON de la API es:
> - Geocoding → `name`, `latitude`, `longitude`, `country`, `admin1` (región), `timezone`.
> - Forecast `current` → `temperature_2m`, `apparent_temperature`, `relative_humidity_2m`, `wind_speed_10m`, `weather_code`.
> - Forecast `daily` → `temperature_2m_max`, `temperature_2m_min`, `weather_code`.

## 4. Plan de implementación

Pasos numerados y ordenados. **Cada paso debe dejar el proyecto ejecutable** y se cierra con un commit.

1. Preparar la estructura HTML, CSS y JavaScript (esqueleto sin datos).
2. Confirmar los parámetros de Open-Meteo (hecho: `count=1` y `language=es` en Geocoding; `current`, `daily` y `timezone=auto` en Forecast).
3. Implementar la búsqueda de ciudades y obtener las coordenadas de la primera coincidencia.
4. Validar la búsqueda: rechazar vacío o menos de 2 caracteres y manejar el caso sin resultados.
5. Obtener el clima con una petición a Forecast (`current` y `daily`).
6. Mostrar el clima actual, traduciendo `weather_code` a texto.
7. Mostrar el pronóstico de al menos tres días con máxima y mínima.
8. Implementar los estados de carga y los mensajes de error (ciudad inexistente, sin conexión, error de la API), con opción de reintentar.
9. Ajustar la interfaz para teléfonos y computadoras.
10. Probar los requisitos, revisar cada cambio y confirmar la checklist de aceptación.

## 5. Criterios de aceptación

- [x] Se puede escribir el nombre de una ciudad y buscarla.
- [x] Una ciudad válida devuelve una ubicación identificable y sus coordenadas.
- [x] El clima actual muestra los cinco datos solicitados.
- [x] La condición del cielo se muestra como texto legible, no como número.
- [x] El pronóstico presenta al menos tres días con máximas y mínimas.
- [x] Se ve un indicador mientras se esperan las respuestas.
- [x] Una ciudad inexistente produce un mensaje comprensible.
- [x] Un fallo de conexión o de la API produce un mensaje visible y no deja la aplicación bloqueada en carga.
- [x] La búsqueda se puede volver a intentar después de un error.
- [ ] La interfaz es usable en una pantalla móvil sin desplazamiento horizontal innecesario.
- [x] La aplicación se abre en el navegador servida localmente con `python -m http.server 8000`, sin depender de un README.
- [x] El proyecto utiliza HTML, CSS y JavaScript puros, sin frameworks ni base de datos.
- [x] No se necesita una clave de API.

**Notas sobre la verificación.** Métodos usados hasta ahora:

- Lógica de la interfaz con un DOM simulado en Node, sin navegador.
- Consultas reales a Open-Meteo desde Node.
- Flujo completo en un navegador real sin interfaz (Edge en modo *headless*), con el `index.html` real y la API real, incluyendo un fallo de API simulado para probar el mensaje de error y el botón "Reintentar".

Todavía **sin probar**:

- El criterio de pantalla móvil: falta la revisión del diseño en un teléfono (paso 9 del plan).
- El fallo de conexión se comprobó simulando el error de la API; no se ha probado una caída de red real.

## 6. Decisiones tomadas y descartadas

**Tomadas:**

- **HTML, CSS y JavaScript puros:** mantienen el código sencillo y fácil de explicar, sin capas de abstracción añadidas por un framework.
- **Open-Meteo:** es gratuito para este uso y no requiere clave de API, así que no hay secretos que gestionar.
- **Geocoding antes de Forecast:** convierte el nombre de una ciudad en coordenadas, que es lo que la API de clima necesita para responder.
- **Servidor local sencillo:** permite ejecutar la aplicación en el navegador sin herramientas de compilación ni dependencias innecesarias.
- **`count=1` y primera coincidencia:** la búsqueda devuelve una sola ubicación, lo que mantiene sencillos el flujo y el modelo de datos.
- **Traducir `weather_code` a texto en el cliente:** la API entrega números (códigos WMO); la tabla de traducción vive en el código de la aplicación.
- **`timezone=auto` en el Forecast:** los datos diarios lo exigen y así no hay que pedir ni guardar zonas horarias.

**Descartadas:**

- **Base de datos:** la primera versión consulta los datos directamente a la API, así que no hay nada que persistir.
- **Geolocalización automática, mapas e historial:** quedan fuera para mantener el alcance enfocado en los requisitos de la hoja de trabajo.
