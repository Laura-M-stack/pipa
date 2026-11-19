# Pipa

Landing de demostración de una app ficticia para aprender a sumar jugando (chicos de 5 a 8 años), con estética **claymorphism**: formas infladas, sombras suaves teñidas y tipografía redondeada. Incluye una lección jugable. Es parte de mi portfolio y no es un producto real.

**Sitio:** https://laura-m-stack.github.io/pipa/

## Qué incluye

- Mini lección "Cuenta con Pipa": cinco sumas hasta 10, con estrellas y bolitas para contar, tres opciones grandes, ayuda después de dos errores y puntaje de 1 a 3 estrellas.
- Sin castigos: equivocarse descarta una opción y se puede volver a intentar.
- La mejor puntuación se guarda solo en el dispositivo (`localStorage`); la app funciona igual si el almacenamiento está bloqueado.
- Ilustración propia en SVG (la mascota Pipa); no usa imágenes de terceros.

## Stack

Svelte 5 (runes), Vite 7, TypeScript estricto y Vitest. CSS propio con variables, sin librerías de UI.

## Estructura

```
src/
  lib/lesson.ts        Generación de preguntas y estado de la lección (funciones puras)
  lib/progress.ts      Mejor resultado guardado en el dispositivo
  components/          Lesson, Mascot, Items, Stars
  App.svelte           Página
  app.css              Tokens y estilos
```

## Scripts

```powershell
npm install
npm run dev
npm test          # lógica de la lección y del progreso
npm run check     # svelte-check + tsc
npm run build     # salida en dist/
```

## Decisiones

- **Lógica fuera de los componentes:** las preguntas y el estado de la lección son funciones puras con una semilla, por lo que se testean sin navegador y la interfaz es una capa fina.
- **Preguntas justas:** las opciones incorrectas quedan a 1 o 2 del resultado, para que el chico tenga que contar; no se repite una suma dentro de una lección (3+2 y 2+3 cuentan como la misma).
- **Accesibilidad:** contraste AA (texto sobre botón primario 5,1:1), foco visible grueso, botones de al menos 56 px, respuestas anunciadas con `aria-live`, foco movido a la siguiente acción y `prefers-reduced-motion` desactiva las animaciones.
- **Tipografías:** Fredoka para títulos y números, Nunito para el texto.

## Límites

- Es una sola lección (sumas hasta 10); no hay cuentas, niveles ni backend.
- Las promesas del apartado "Para familias" describen el producto imaginado de la demo.

## Publicación

GitHub Pages con `.github/workflows/deploy.yml` (Settings, Pages, Source: GitHub Actions). El workflow usa `npm ci`, así que hay que subir `package-lock.json`.
