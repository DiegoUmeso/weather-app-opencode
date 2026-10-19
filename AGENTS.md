# AGENTS.md

Guía para sesiones de OpenCode en este repositorio.

## Estado actual del repo

- Proyecto **weather-app**: HTML/CSS/JS "vanilla" (sin framework, sin build tool, sin `package.json`).
- Rama por defecto: **`master`**. El repositorio ya tiene historial de commits (uno por etapa del SPEC) y **sin remoto configurado**.
- La aplicación está implementada y funciona: búsqueda de ciudad, clima actual, pronóstico de 3 días, estados de carga y errores, y botón "Reintentar". Archivos: `index.html`, `styles.css`, `js/api.js` (llamadas a Open-Meteo) y `js/app.js` (interfaz).
- Requisitos y criterios de aceptación en `specs/01-weather-app.md`.
- No hay pipeline de `lint`, `typecheck`, `test` ni `build`. No inventes comandos: si el proyecto crece, agrégalos aquí.

## Decisiones del proyecto (fijadas por el usuario)

- **HTML, CSS y JavaScript puros**, sin frameworks, sin librerías de UI y sin build tool.
- **Datos del clima: API gratuita Open-Meteo**, sin API key. Se usa en dos pasos:
  1. *Geocoding* (buscar el nombre de la ciudad) → `https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=1&language=es&format=json`. Devuelve `latitude`, `longitude`, `name`, `country`, `timezone`.
  2. *Forecast* (consultar el clima) → `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m,...` (usa la lat/lon del paso anterior).
- **Sin base de datos y sin claves de API.** No hace falta `.env` para secretos; todo se consulta directo al navegador.
- **Debe funcionar localmente en el navegador**, preferiblemente servida con un servidor local sencillo (ver abajo), no solo abriendo el archivo.
- **Código sencillo, organizado y fácil de explicar.** Prioriza claridad sobre optimización.

## Flujo de trabajo (obligatorio)

1. **Antes de escribir código de la aplicación, crear un `SPEC`** con los requisitos y los criterios de aceptación. No empezar a construir la app hasta que el usuario apruebe ese SPEC.
2. Al probar, cubrir explícitamente:
   - errores de búsqueda (ciudad inexistente o vacía),
   - errores de conexión (la API no responde / falla),
   - diseño en pantallas de teléfono (responsive).

## Ejecutar / previsualizar

No hay servidor de desarrollo. Opciones reales (verificadas como disponibles):

- Abrir `index.html` directamente en el navegador.
- Servir estáticos desde la raíz: `python -m http.server 8000` o `npx serve .` (Node está instalado).

## Gotchas del entorno

- Git **sí está disponible** ahora (`git` 2.55). La rama por defecto de este repo es **`master`**, no `main`: no asumas `main` ni la renombres sin preguntar.
- Al imprimir texto en PowerShell, los acentos pueden verse mal (mojibake). No es corrupción de archivos.
- Los elementos que se ocultan con el atributo `hidden` necesitan que el CSS no les fije su propio `display`. `styles.css` incluye `[hidden] { display: none !important; }` por ese motivo: un `display: grid` anulaba el ocultado.
- Para probar la interfaz sin navegador visible se puede usar Edge en modo *headless*: `msedge.exe --headless --dump-dom <url>` (instalado en `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`).

## Convenciones

- Preferir archivos estáticos sin dependencias. **No instalar paquetes ni añadir herramientas sin preguntar primero.**
- Como no hay bundler, los archivos `.env` **no se cargan solos en el navegador** (no existe `dotenv` en el front). En este proyecto no se necesitan: Open-Meteo no usa claves de API.
- `.gitignore` ya cubre `.env`, `.env.local`, `node_modules/`, `dist/` y `*.log`; no hace falta volver a añadirlos si se introduce tooling.
