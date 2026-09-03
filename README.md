# Juego de la Vida de Conway - Laboratorio Celular 3D ✨

Simulador visual, interactivo y táctil del **Juego de la Vida de Conway** con renderizado 3D de células tipo microburbujas, soporte para múltiples reglas biológicas y adaptado para móviles, tablets y escritorio.

---

## 🚀 Despliegue en GitHub Pages

Este proyecto utiliza **Vite + React + Tailwind CSS**.

### Opción 1: Despliegue Automático con GitHub Actions (Recomendada)

El repositorio incluye el archivo `.github/workflows/deploy.yml`. Para activar el despliegue automático:

1. Ve a tu repositorio en GitHub.
2. Entra en **Settings** > **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment** > **Source**, selecciona **GitHub Actions**.
4. ¡Listo! Cada vez que hagas `git push` a la rama `main` (o ejecutes el workflow manualmente en la pestaña **Actions**), GitHub construirá la aplicación y la publicará automáticamente en tu URL de GitHub Pages.

---

### Opción 2: Despliegue Manual con los archivos estáticos (`dist/`)

Si prefieres subir directamente los archivos ya construidos (HTML, CSS y JS):

1. En tu máquina local, ejecuta:
   ```bash
   npm install
   npm run build
   ```
2. La carpeta generada **`dist/`** contendrá:
   - `index.html`
   - `assets/` (con los archivos compilados de JavaScript y CSS con rutas relativas `./assets/...`)
3. Puedes subir directamente el contenido de la carpeta `dist/` a una rama llamada `gh-pages` o configurarla en **Settings > Pages > Deploy from a branch**.

---

## 🛠️ Ejecución Local

Para probar la aplicación en tu computadora:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 🧠 ¿Usa la API de Gemini?

Esta versión del Juego de la Vida funciona **100% en el cliente (en tu navegador)** mediante cálculos matemáticos ultrarrápidos y Canvas API de alto rendimiento a 60 FPS. **No requiere ninguna API Key de Gemini ni servicios de servidor externos para funcionar**, lo que garantiza que nunca fallará en GitHub Pages o Vercel por falta de credenciales.
