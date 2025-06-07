const frases = [
  "Cada día es una nueva oportunidad.",
  "Confía en tu proceso.",
  "Hacelo con miedo, pero hacelo.",
  "Tu esfuerzo hoy es tu éxito mañana.",
  "Respirá, vos podés con esto.",
  "Nada cambia si nada cambia.",
  "Sé constante, no perfecto.",
  "Lo importante es avanzar, aunque sea de a poco."
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
  const tareas = document.getElementById("tareas").value;
  const mejor = document.getElementById("mejor").value;

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
        backgroundColor: ["#81C784", "#64B5F6", "#E57373", "#FFD54F"]
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

window.onload = () => {
  nuevaFrase();
  mostrarSeccion("inicio");
};
