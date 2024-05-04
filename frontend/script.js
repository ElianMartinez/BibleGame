const url = "http://localhost:3000";
const preguntaTexto = document.getElementById("pregunta-texto");
const tiempoRestante = document.getElementById("tiempo-restante");
const btnNivel1 = document.getElementById("btn-nivel-1");
const btnNivel2 = document.getElementById("btn-nivel-2");
const btnNivel3 = document.getElementById("btn-nivel-3");
const btnNuevaPregunta = document.getElementById("btn-nueva-pregunta");
const btnMostrarRespuesta = document.getElementById("btn-mostrar-respuesta");
const btnReset = document.getElementById("btn-reset");

let preguntaActual = null;
let intervaloContador = null;

// Función para obtener una pregunta del backend
function obtenerPregunta(nivel) {
  fetch(`${url}/pregunta/${nivel}`)
    .then((response) => response.json())
    .then((pregunta) => {
      if (pregunta) {
        preguntaActual = pregunta;
        preguntaTexto.textContent = pregunta.Question;

        // Detener el contador si hay uno en ejecución
        if (intervaloContador) {
          clearInterval(intervaloContador);
          intervaloContador = null;
        }

        // Iniciar el contador con el tiempo del nivel
        iniciarContador(pregunta.Level);
      } else {
        console.error("Error al obtener pregunta");
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Función para iniciar el contador
function iniciarContador(nivelPregunta) {
  let segundosRestantes;

  switch (nivelPregunta) {
    case 1:
      segundosRestantes = 10 + 10;
      break;
    case 2:
      segundosRestantes = 20 + 10;
      break;
    case 3:
      segundosRestantes = 30 + 10;
      break;
    default:
      segundosRestantes = 10 + 10; // Valor por defecto si el nivel no es válido
  }

  intervaloContador = setInterval(() => {
    segundosRestantes--;

    if (segundosRestantes === 0) {
      clearInterval(intervaloContador);
      intervaloContador = null;
    } else {
      tiempoRestante.textContent = segundosRestantes;
    }
  }, 1000);
}

// Función para mostrar la respuesta (implementar la lógica para obtenerla)
function mostrarRespuesta() {
  preguntaTexto.textContent = preguntaActual.Answer + " " + preguntaActual.Cite;
}

// Función para reiniciar las preguntas
function reiniciarPreguntas() {
  fetch(`${url}/reset`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);

      // Opcional: Limpiar la pregunta actual y resetear el contador
      preguntaActual = null;
      preguntaTexto.textContent = "";
      tiempoRestante.textContent = "";
      clearInterval(intervaloContador);
      intervaloContador = null;
    })
    .catch((error) => console.error("Error:", error));
}
