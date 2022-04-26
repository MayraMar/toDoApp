/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
  let regexNombre = /[a-z]+[^0-9]/i;
  return regexNombre.test(texto);
}

function normalizarTexto(texto) {
  //return texto.trim();
  return texto
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexEmail.test(email);
}

function normalizarEmail(email) {}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
  return contrasenia.length > 3 ? true : false;
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
  return contrasenia_1 === contrasenia_2 ? true : false;
}
