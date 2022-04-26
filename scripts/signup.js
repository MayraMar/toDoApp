window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
 
  const form = document.forms[0];
  const nombre = document.querySelector("#inputNombre");
  const apellido = document.getElementById("inputApellido");
  const email = document.querySelector("#inputEmail");
  const password = document.querySelector("#inputPassword");
  const passwordRepe=document.querySelector("#inputPasswordRepetida");
  const url = "https://ctd-fe2-todo-v2.herokuapp.com/v1"; // Asi luego solo agrego el endpoint que necesito. Dejo la URL base.
  const erroresDiv = document.querySelector(".errores");
  const container=document.querySelectorAll(".container")[1];
  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    erroresDiv.innerHTML="";
    erroresDiv.classList.add("hidden");
    mostrarSpinner();
    let errores = [];
    if (!validarTexto(nombre.value)) {
      errores.push("El nombre debe tener al menos dos caracteres alfabéticos");
    }
    if (!validarTexto(apellido.value)) {
      errores.push(
        "El apellido debe tener al menos dos caracteres alfabéticos"
      );
    }
    if (!validarEmail(email.value)) {
      errores.push("Por favor ingrese un email válido");
    }
    if (!validarContrasenia(password.value)) {
      errores.push("La contraseña debe tener al menos 4 caracteres");
    }

    if(!compararContrasenias(password.value,passwordRepe.value)){
      errores.push("Las contraseñas deben coincidir");
    }

    if (errores.length == 0) {
      let data = {
        firstName: normalizarTexto(nombre.value),
        lastName: normalizarTexto(apellido.value),
        email: email.value,
        password: password.value,
      };
      let settings = {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      };
      
      realizarRegister(settings);
    } else {
      console.log(errores);
      ocultarSpinner();
      erroresDiv.classList.remove("hidden");
      for (const error of errores) {
        erroresDiv.innerHTML += `<li>${error}</li>`;
      }
     
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarRegister(settings) {
    fetch(`${url}/users`, settings)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.jwt) {
          ocultarSpinner();
          localStorage.setItem("jwt", data.jwt);
          console.log("Registracion exitosa");
          form.classList.add("hidden");
          container.innerHTML=`
            <h1 class="exito">Registro exitoso! </h1>
              
          `
          setTimeout(() => { //esto esta funcionando bien
            location.replace("./index.html");
          }, 3000);
          
        } else {
          ocultarSpinner()
          erroresDiv.classList.remove("hidden");
          erroresDiv.innerHTML = data;
        }
      })
      .catch((err) => {
        erroresDiv.classList.remove("hidden");
        erroresDiv.innerHTML = err;
      });
  }
});
