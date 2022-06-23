function ValidarDatosIngresados() {
  const CUIT = "30123456785";
  const CONTRASEÑA = "123ABC__";

  let username = document.getElementById("txt-username").value;
  let password = document.getElementById("txt-password").value;

  if (username.length == 0) {
    alert("Falta ingresar Cuit/Cuil");
  }

  if (password.length == 0) {
    alert("Falta ingresar la Contaseña");
  }

  if (username == CUIT && password == CONTRASEÑA) {
    alert("Usuario valido!")
  } else {
    alert("Usuario no valido!")
  }
}