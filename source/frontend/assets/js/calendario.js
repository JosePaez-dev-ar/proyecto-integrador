var calendario = {
  // PROPIEDADES: COMUNES DEL CALENDARIO
  empiezaSemanaLunes: false, // ¿El comienzo de la semana es Lunes?
  nombreMeses: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ], // Nombre de los meses

  // PROPIEDADES: DATOS DEL CALENDARIO
  agenda: null, // Eventos para el período seleccionado
  diaSeleccionado: 0,
  mesSeleccionado: 0,
  añoSeleccionado: 0, // día, mes, año actualmente seleccionado

  // PROPIEDADES: ELEMENTOS HTML COMUNES
  elementMes: null, // selector mes
  elementAño: null, // selector año
  elementFormulario: null,
  elementEncabezado: null,
  elementFecha: null,
  elementDetalle: null,
  elementEliminar: null, // Form de eventos

  // INICIALIZAR CALENDARIO
  inicializar: () => {
    // OBTENER Y ASIGNAR REFERENCIAS DE ELEMENTOS HTML COMUNES
    calendario.elementMes = document.getElementById("select-mes");
    calendario.elementAño = document.getElementById("select-año");
    calendario.elementFormulario = document.getElementById("form-calendario");
    calendario.elementEncabezado = document.getElementById("header-encabezado");
    calendario.elementFecha = document.getElementById("container-fecha");
    calendario.elementDetalle = document.getElementById("text-detalle");
    calendario.elementEliminar = document.getElementById("button-eliminar");

    document.getElementById("button-cerrar").onclick = calendario.cerrarFormulario;
    calendario.elementEliminar.onclick = calendario.eliminarEvento;
    calendario.elementFormulario.onsubmit = calendario.guardarEvento;

    // FECHA ACTUAL
    let fechaActual = new Date()
    let mesActual = fechaActual.getMonth()
    let añoActual = parseInt(fechaActual.getFullYear())

    // AGREGAR EL SELECTOR DE MESES
    for (let i = 0; i < 12; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = calendario.nombreMeses[i];
      if (i == mesActual) {
        opt.selected = true;
      }
      calendario.elementMes.appendChild(opt);
    }

    calendario.elementMes.onchange = calendario.dibujar;

    // AGREGAR EL SELECTOR DE AÑOS
    // Se ha establecido en un rango de 10 años.
    for (let i = añoActual - 10; i <= añoActual + 10; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = i;
      if (i == añoActual) {
        opt.selected = true;
      }
      calendario.elementAño.appendChild(opt);
    }
    calendario.elementAño.onchange = calendario.dibujar;

    // INICIAR - DIBUJAR CALENDARIO
    calendario.dibujar();
  },

  // DIBUJAR EL CALENDARIO PARA EL MES SELECCIONADO 
  dibujar: () => {
    // HACER CÁLCULOS BÁSICOS : DÍAS DEL MES, DÍA DE INICIO Y FIN
    // Enero es 0 y Diciembre es 11
    // Domingo es 0 y Sábado es 6
    calendario.mesSeleccionado = parseInt(calendario.elementMes.value); // mes seleccionado
    calendario.añoSeleccionado = parseInt(calendario.elementAño.value); // año seleccionado

    let diasEnElMes = new Date(calendario.añoSeleccionado, calendario.mesSeleccionado + 1, 0).getDate() // número de días en el mes seleccionado

    let diaInicio = new Date(calendario.añoSeleccionado, calendario.mesSeleccionado, 1).getDay() // primer día del mes

    let diaFinal = new Date(calendario.añoSeleccionado, calendario.mesSeleccionado, diasEnElMes).getDay() // último día del mes

    let fechaActual = new Date() // fecha actual

    let añoActual = parseInt(fechaActual.getFullYear()) // año actual

    let mesActual = fechaActual.getMonth() // mes actual

    let diaActual =
      calendario.mesSeleccionado == mesActual && calendario.añoSeleccionado == añoActual ? fechaActual.getDate() : null;

    // CARGAR DATOS DESDE EL ALMACENAMIENTO LOCAL
    calendario.agenda = localStorage.getItem("agenda-" + calendario.añoSeleccionado + "-" + calendario.mesSeleccionado);

    if (calendario.agenda == null) {
      localStorage.setItem("agenda-" + calendario.añoSeleccionado + "-" + calendario.mesSeleccionado, "{}");
      calendario.agenda = {};
    } else {
      calendario.agenda = JSON.parse(calendario.agenda);
    }

    // HACER CÁLCULOS DEL DIBUJO
    // Cuadrados en blanco antes del comienzo del mes
    let cuadricula = [];
    if (calendario.empiezaSemanaLunes && diaInicio != 1) {
      let enBlanco = diaInicio == 0 ? 7 : diaInicio;
      for (let i = 1; i < enBlanco; i++) {
        cuadricula.push("v");
      }
    }
    if (!calendario.empiezaSemanaLunes && diaInicio != 0) {
      for (let i = 0; i < diaInicio; i++) {
        cuadricula.push("v");
      }
    }

    // Dias del mes
    for (let i = 1; i <= diasEnElMes; i++) {
      cuadricula.push(i);
    }

    // Cuadrados en blanco después de fin de mes
    if (calendario.empiezaSemanaLunes && diaFinal != 0) {
      let enBlanco = diaFinal == 6 ? 1 : 7 - diaFinal;
      for (let i = 0; i < enBlanco; i++) {
        cuadricula.push("v");
      }
    }
    if (!calendario.empiezaSemanaLunes && diaFinal != 6) {
      let enBlanco = diaFinal == 0 ? 6 : 6 - diaFinal;
      for (let i = 0; i < enBlanco; i++) {
        cuadricula.push("v");
      }
    }

    //  DIBUJAR CALENDARIO HTML
    // Obtener contenedor
    let container = document.getElementById("container-calendario"),
      tabla = document.createElement("table");
    tabla.id = "table-calendario";
    container.innerHTML = "";
    container.appendChild(tabla);

    // Primera fila: nombres de los días
    let fila = document.createElement("tr"),
      nombreDias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    if (calendario.empiezaSemanaLunes) {
      nombreDias.push(nombreDias.shift());
    }
    for (let d of nombreDias) {
      let celda = document.createElement("td");
      celda.innerHTML = d;
      fila.appendChild(celda);
    }
    fila.classList.add("head");
    tabla.appendChild(fila);

    // Días en el Mes
    let total = cuadricula.length;
    fila = document.createElement("tr");
    fila.classList.add("dia");
    for (let i = 0; i < total; i++) {
      let celda = document.createElement("td");
      if (cuadricula[i] == "v") {
        celda.classList.add("vacio");
      } else {
        if (diaActual == cuadricula[i]) {
          celda.classList.add("hoy");
        }
        celda.innerHTML = `<div class="datos">${cuadricula[i]}</div>`;
        if (calendario.agenda[cuadricula[i]]) {
          celda.innerHTML +=
            "<div class='evento'>" + calendario.agenda[cuadricula[i]] + "</div>";
        }
        celda.onclick = () => {
          calendario.mostrarFormulario(celda);
        };
      }
      fila.appendChild(celda);
      if (i != 0 && (i + 1) % 7 == 0) {
        tabla.appendChild(fila);
        fila = document.createElement("tr");
        fila.classList.add("dia");
      }
    }

    // OCULTAR CUALQUIER FORMULARIO DE AGREGAR/EDITAR EVENTO ANTERIOR
    calendario.cerrarFormulario();
  },

  //  MOSTRAR EL FORMULARIO PARA EDITAR EL EVENTO PARA EL DÍA SELECCIONADO
  mostrarFormulario: (el) => {
    // OBTENER LOS DATOS EXISTENTES
    calendario.diaSeleccionado = el.getElementsByClassName("datos")[0].innerHTML;
    let isEdit = calendario.agenda[calendario.diaSeleccionado] !== undefined;

    // ACTUALIZAR EL FORMULARIO DE EVENTO
    calendario.elementDetalle.value = isEdit ? calendario.agenda[calendario.diaSeleccionado] : "";
    calendario.elementEncabezado.innerHTML = isEdit ? "Editar Evento" : "Agregar Evento";
    calendario.elementFecha.innerHTML = `${calendario.diaSeleccionado} ${calendario.nombreMeses[calendario.mesSeleccionado]} ${calendario.añoSeleccionado}`;
    if (isEdit) {
      calendario.elementEliminar.classList.remove("invisible");
    } else {
      calendario.elementEliminar.classList.add("invisible");
    }
    calendario.elementFormulario.classList.remove("invisible");
  },

  // CERRAR FORMULARIO DEL EVENTO
  cerrarFormulario: () => {
    calendario.elementFormulario.classList.add("invisible");
  },

  // GUARDAR EVENTO
  guardarEvento: () => {
    calendario.agenda[calendario.diaSeleccionado] = calendario.elementDetalle.value;
    localStorage.setItem(
      `agenda-${calendario.añoSeleccionado}-${calendario.mesSeleccionado}`,
      JSON.stringify(calendario.agenda)
    );
    calendario.dibujar();
    return false;
  },

  // ELIMINAR EL EVENTO PARA LA FECHA SELECCIONADA
  eliminarEvento: () => {
    if (confirm("¿Confirma eliminar el evento?")) {
      delete calendario.agenda[calendario.diaSeleccionado];
      localStorage.setItem(
        `agenda-${calendario.añoSeleccionado}-${calendario.mesSeleccionado}`,
        JSON.stringify(calendario.agenda)
      );
      calendario.dibujar();
    }
  },
};
window.addEventListener("load", calendario.inicializar);