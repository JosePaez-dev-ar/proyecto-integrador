function registrarUsuario() {

  let apellido = document.getElementById("txt-apellido").value
  let nombre = document.getElementById("txt-nombre").value
  let email = document.getElementById("txt-email").value
  let password = document.getElementById("txt-password").value
  let passwordRepeat = document.getElementById("txt-password-repeat").value

  let usuario = new Usuario(apellido, nombre, email, password)
  agregarUsuario(usuario)

  restablecerFormulario()
}

function agregarUsuario(usuario) {
  usuarios.push(usuario)
  mostrarMensaje("Usuario registrado con éxito!")
  listarUsuarios()
}

function eliminarUsuario(indice) {
  usuarios.splice(indice, 1)
  mostrarMensaje("Usuario eliminado con éxito!")
  listarUsuarios()
}

function mostrarMensaje(mensaje) {
  alert(mensaje)
}

function restablecerFormulario() {
  document.getElementById("frm-registro").reset()
}

function listarUsuarios() {
  let tblbody = document.getElementById("tbl-body")
    //Limpiar contenido de TBody
  tblbody.innerHTML = ""

  for (let i = 0; i < usuarios.length; i++) {
    var row = tblbody.insertRow(tblbody.rows.length);
    row.insertCell(0).innerHTML = usuarios[i].apellido;
    row.insertCell(1).innerHTML = usuarios[i].nombre;
    row.insertCell(2).innerHTML = usuarios[i].email;
    row.insertCell(3).innerHTML =
      `<a href="#" onclick="eliminarUsuario(${i})">Eliminar</a>`
  }
}