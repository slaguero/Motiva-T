const frases = [
  "Cada día es una nueva oportunidad.",
  "Confía en tu proceso.",
  "Hacelo con miedo, pero hacelo.",
  "Tu esfuerzo hoy es tu éxito mañana.",
  "Respirá, vos podés con esto.",
  "Sé constante, no perfecto.",
  "Lo importante es avanzar, aunque sea de a poco.",
  "Todo logro empieza con la decisión de intentarlo.",
  "No esperes a sentirte listo, empezá ahora.",
  "El progreso, no la perfección, es lo que importa.",
  "Estás más cerca de lo que pensás.",
  "La disciplina tarde o temprano vence al talento.",
  "Tu yo del futuro te va a agradecer por no rendirte hoy.",
  "Cada pequeño paso cuenta.",
  "No tenés que hacerlo todo hoy, solo algo.",
  "Hoy es un buen día para avanzar, aunque sea un poquito.",
  "No es suerte, es constancia.",
  "Lo estás haciendo mejor de lo que creés."
];


function nuevaFrase() {
  const frase = frases[Math.floor(Math.random() * frases.length)];
  document.getElementById("fraseMotivadora").textContent = frase;
}

function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(s => s.classList.remove("activa"));
  const target = document.getElementById(id);
  target.classList.add("activa");

  if (id === "registros") mostrarRegistros();
  if (id === "estadisticas") mostrarEstadisticas();
}

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const estado = document.getElementById("estado").value;
  const tareas = document.getElementById("tareas").value.trim();
  const mejor = document.getElementById("mejor").value.trim();

  if (!tareas || !mejor) {
    mostrarToast("Completá los campos 🤔");
    return;
  }
  const registro = {
    fecha: new Date().toLocaleDateString(),
    estado,
    tareas,
    mejor
  };

  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros.push(registro);
  localStorage.setItem("registros", JSON.stringify(registros));

  this.reset();
  alert("Registro guardado 😊");
  mostrarSeccion("registros");
});

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("mostrar");

  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 3000); 
}

function mostrarRegistros() {
  const contenedor = document.getElementById("registrosContainer");
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const filtro = document.getElementById("filtroEstado").value;

  const filtrados = filtro ? registros.filter(r => r.estado === filtro) : registros;

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay registros.</p>";
    return;
  }

  contenedor.innerHTML = filtrados.map((r, i) => `
    <div class="registro-item">
      <strong>${r.fecha}</strong> ${r.estado}<br/>
      <em>Lo mejor:</em> ${r.mejor}<br/>
      <em>Tareas:</em> ${r.tareas}<br/>
      <button onclick="eliminarRegistro(${i})">Eliminar</button>
    </div>
  `).join("");
}

function eliminarRegistro(indice) {
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros.splice(indice, 1);
  localStorage.setItem("registros", JSON.stringify(registros));
  mostrarRegistros();
  mostrarToast("Registro eliminado ​✔️​");
}

let graficoBarras; 

function mostrarEstadisticas() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const conteo = { "😀": 0, "😐": 0, "😞": 0, "😠": 0 };

  registros.forEach(r => conteo[r.estado]++);
  const total = registros.length || 1;

  const ctx = document.getElementById("graficoBarras").getContext("2d");

  if (graficoBarras) graficoBarras.destroy();

  graficoBarras = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Feliz 😀", "Normal 😐", "Triste 😞", "Molesto 😠"],
      datasets: [{
        label: "Cantidad de veces",
        data: [
          conteo["😀"],
          conteo["😐"],
          conteo["😞"],
          conteo["😠"]
        ],
        backgroundColor: ["#81C784", "#FFD54F", "#64B5F6", "#E57373"]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `Estados emocionales registrados (${total} días)`
        }
      }
    }
  });
}
const temas = [
  { nombre: "Oscuro", clase: "tema-oscuro" },
  { nombre: "Rosa", clase: "tema-rosa" },
  { nombre: "Verde", clase: "tema-verde" },
  { nombre: "Azul", clase: "tema-azul" },
  { nombre: "Amarillo", clase: "tema-amarillo" },
  { nombre: "Violeta", clase: "tema-violeta" }
];

let temaActual = 0;

document.getElementById("botonInteractivo").addEventListener("click", () => {
  temas.forEach(t => document.body.classList.remove(t.clase));
  temaActual = (temaActual + 1) % temas.length;
  const nuevoTema = temas[temaActual];
  document.body.classList.add(nuevoTema.clase);
  mostrarNotificacion(`Tema ${nuevoTema.nombre} activado`);
});

function mostrarNotificacion(mensaje) {
  let noti = document.createElement("div");
  noti.className = "notificacion-tema";
  noti.textContent = mensaje;
  document.body.appendChild(noti);

  setTimeout(() => {
    noti.classList.add("visible");
  }, 10);

  setTimeout(() => {
    noti.classList.remove("visible");
    setTimeout(() => noti.remove(), 300);
  }, 2000);
}

window.onload = () => {
  nuevaFrase();
  mostrarSeccion("inicio");
};
