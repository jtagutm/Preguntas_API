const API_KEY = "AIzaSyAiq5OUrwNFTxCCEyD8MIeAC8Vhv_JC9Ao";
const MODEL = "gemini-2.0-flash";

let correctas = 0;
let incorrectas = 0;
let preguntaActual = null;

function desplegarContadores() {
    const guardados = localStorage.getItem('triviaContadores');
    if (guardados) {
        const datos = JSON.parse(guardados);
        correctas = datos.correctas || 0;
        incorrectas = datos.incorrectas || 0;
    }
    document.getElementById('correctas').textContent = correctas;
    document.getElementById('incorrectas').textContent = incorrectas;
}

function guardarContadores() {
    localStorage.setItem('triviaContadores', JSON.stringify({
        correctas: correctas,
        incorrectas: incorrectas
    }));
}

async function generarAPI() {
    const temas = [
        "concepto de arreglo y operaciones sobre arreglos",
        "concepto de diccionarios y funciones básicas",
        "operadores lógicos, aritméticos, de comparación, ternario",
        "uso de la consola para debuggear",
        "funciones con parámetros por default",
        "historia de videojuegos clásicos",
        "personajes famosos de videojuegos",
        "consolas de videojuegos y sus características",
        "géneros de videojuegos",
        "desarrolladores y estudios de videojuegos famosos"
    ];

    const temaAleatorio = temas[Math.floor(Math.random() * temas.length)];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const prompt = `En el contexto de JavaScript, CSS y HTML. Genera una pregunta de opción múltiple sobre el siguiente tema ${temaAleatorio}. Proporciona cuatro opciones de respuesta y señala cuál es la correcta.    
    Genera la pregunta y sus posibles respuestas en formato JSON como el siguiente ejemplo, asegurándote de que el resultado SÓLO contenga el objeto JSON y no texto adicional enseguida te doy dos ejemplos:  
    1. Sobre arreglos en JavaScript:
    {
      "question": "¿Cuál de los siguientes métodos agrega un elemento al final de un arreglo en JavaScript?",
      "options": [
        "a) shift()",
        "b) pop()",
        "c) push()",
        "d) unshift()"
      ],
      "correct_answer": "c) push()",
      "explanation": "El método push() agrega uno o más elementos al final de un arreglo y devuelve la nueva longitud del arreglo."
    }
    2. Sobre eventos en JavaScript:
    {
      "question": "¿Cuál de los siguientes eventos se dispara cuando un usuario hace clic en un elemento HTML?",
      "options": [
        "a) onmouseover",
        "b) onclick",
        "c) onload",
        "d) onsubmit"
      ],
      "correct_answer": "b) onclick",
      "explanation": "El evento 'onclick' se dispara cuando un usuario hace clic en un elemento HTML, permitiendo ejecutar funciones en respuesta a ese clic."
    }`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.25,
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error HTTP ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log("Respuesta transformada a json:", data);

        const textResult = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const textResultTrimmed = textResult.trim();
        const firstBraceIndex = textResultTrimmed.indexOf('{');
        const lastBraceIndex = textResultTrimmed.lastIndexOf('}');
        const jsonString = textResultTrimmed.substring(firstBraceIndex, lastBraceIndex + 1);

        if (jsonString) {
            const questionData = JSON.parse(jsonString);
            console.log(questionData);
            return questionData;
        } else {
            console.log("No se pudo extraer el texto de la respuesta.");
        }

    } catch (error) {
        console.error("Hubo un error en la petición:", error);
        document.getElementById('question').textContent = 'Error al cargar la pregunta. Por favor, revisa la clave API o la consola.';
        return null;
    }
}

function desplegarPregunta(datosPregunta) {
    preguntaActual = datosPregunta;
    
    document.getElementById('question').className = 'fs-5 text-dark';
    document.getElementById('question').innerHTML = datosPregunta.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    datosPregunta.options.forEach((opcion) => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-dark';
        button.style.transition = 'all 0.3s ease';
        button.textContent = opcion;
        button.onmouseover = () => {
            button.style.transform = 'translateY(-5px)';
            button.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
        };
        button.onmouseout = () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        };
        button.onclick = () => verificarRespuesta(opcion, button);
        optionsContainer.appendChild(button);
    });
}

function verificarRespuesta(opcionSeleccionada, botonSeleccionado) {
    const buttons = document.querySelectorAll('#options button');
    buttons.forEach(btn => btn.disabled = true);
    
    if (opcionSeleccionada === preguntaActual.correct_answer) {
        botonSeleccionado.className = 'btn btn-success';
        correctas++;
        
        const explicacion = document.createElement('div');
        explicacion.className = 'alert alert-success mt-3';
        explicacion.innerHTML = `<strong>¡Correcto!</strong> ${preguntaActual.explanation}`;
        document.getElementById('question-container').appendChild(explicacion);
    } else {
        botonSeleccionado.className = 'btn btn-danger';
        incorrectas++;
        
        buttons.forEach(btn => {
            if (btn.textContent === preguntaActual.correct_answer) {
                btn.className = 'btn btn-success';
            }
        });
        
        const explicacion = document.createElement('div');
        explicacion.className = 'alert alert-danger mt-3';
        explicacion.innerHTML = `<strong>Incorrecto.</strong> ${preguntaActual.explanation}`;
        document.getElementById('question-container').appendChild(explicacion);
    }
    
    guardarContadores();
    desplegarContadores();
    
    setTimeout(() => {
        const siguienteBtn = document.createElement('button');
        siguienteBtn.className = 'btn btn-primary mt-3';
        siguienteBtn.textContent = 'Siguiente pregunta';
        siguienteBtn.onclick = cargarPregunta;
        document.getElementById('question-container').appendChild(siguienteBtn);
    }, 500);
}

async function cargarPregunta() {
    const container = document.getElementById('question-container');
    container.innerHTML = '<p id="question" class="fs-5 text-warning">Cargando pregunta de Gemini...</p><div id="options" class="d-grid gap-2"></div>';
    
    const datosPregunta = await generarAPI();
    console.log(datosPregunta);

    if (datosPregunta) {
        console.log("Datos de la pregunta recibidos:", datosPregunta);
        desplegarPregunta(datosPregunta);
    }
}

function resetearContadores() {
    if (confirm('¿Estás seguro de que quieres resetear?')) {
        correctas = 0;
        incorrectas = 0;
        localStorage.removeItem('triviaContadores');
        desplegarContadores();
    }
}


window.onload = () => {
    console.log("Página cargada y función inicial ejecutada.");
    
    // Agregar botón de reset
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-sm btn-outline-danger ms-3';
    resetBtn.textContent = 'Reset';
    resetBtn.onclick = resetearContadores;
    document.getElementById('container').appendChild(resetBtn);
    
    desplegarContadores();
    cargarPregunta();
};
