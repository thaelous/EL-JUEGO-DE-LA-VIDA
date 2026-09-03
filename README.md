# El Juego de la Vida de Conway por Robert Pacheco ✨

Simulador visual, interactivo y táctil del **Juego de la Vida de Conway por Robert Pacheco** con renderizado 3D de células tipo microburbujas, soporte para múltiples reglas biológicas y adaptado para móviles, tablets y escritorio.

---

## 🚀 Despliegue en GitHub Pages

Este proyecto está preparado en **formato web estándar (HTML5, CSS3 y JavaScript plano)** y también incluye soporte para compilación con Vite. Puedes desplegarlo de dos formas súper sencillas:

### Opción 1: Despliegue Directo (Sin compiladores ni dependencias) ⭐ ¡La más fácil!

Los archivos en la raíz del repositorio (`index.html`, `style.css` y `app.js`) son **estándar y completamente independientes**:
1. Sube tu código al repositorio en GitHub.
2. Ve a **Settings** > **Pages** en tu repositorio.
3. En **Build and deployment** > **Source**, elige **Deploy from a branch**.
4. Selecciona la rama `main` (o `master`) y la carpeta `/ (root)`.
5. Pulsa **Save**. En 1 minuto tu aplicación estará funcionando en vivo sin necesidad de compilar nada.

---

### Opción 2: Despliegue Automático con GitHub Actions

El repositorio incluye el archivo `.github/workflows/deploy.yml`. Si prefieres compilar la versión optimizada:
1. En GitHub, ve a **Settings** > **Pages**.
2. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
3. GitHub ejecutará el workflow automáticamente y publicará los artefactos de `dist/`.

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
