# Trivia de Preguntas

Aplicación web de trivia que genera preguntas aleatorias usando la API de Google Gemini sobre programación y videojuegos.

## Características

- Preguntas generadas por IA (Gemini API)
- Temas de JavaScript, CSS, HTML y Videojuegos
- Contador de respuestas correctas/incorrectas
- Guardado automático en localStorage
- Explicaciones después de cada respuesta

## Requisitos

- Navegador web moderno
- Clave API de Google Gemini

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/TU_USUARIO/trivia-preguntas.git
```

2. Abre `preguntas.html` en tu navegador

3. Agrega tu API key en `js/scriptv2.js`:
```javascript
const API_KEY = "TU_API_KEY_AQUI";
```

## Estructura

```
/
├── preguntas.html
└── js/
    └── scriptv2.js
```

## Uso

1. Abre la página
2. Lee la pregunta
3. Selecciona una respuesta
4. Haz clic en "Siguiente pregunta"
5. Usa el botón "Resetear" para reiniciar contadores

## Tecnologías

- HTML5
- JavaScript
- Google Gemini API

## 📝 Licencia

MIT
