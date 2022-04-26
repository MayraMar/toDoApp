window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.querySelector("form");
  const email = document.querySelector("#inputEmail");
  const pass = document.querySelector("#inputPassword");
  const url = "https://ctd-fe2-todo-v2.herokuapp.com/v1";
  const errores= document.querySelector(".errores");

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    
    mostrarSpinner();
    let data = {
      email: email.value,
      password: pass.value,
    };
    let settings = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    };
    realizarLogin(settings);
    
  });

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 2: Realizar el login [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarLogin(settings) {
    fetch(`${url}/users/login`, settings)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt);
          //ocultarSpinner();
          location.replace("./mis-tareas.html");
        } else {
          ocultarSpinner();
          console.log("no es exitoso el login");
          errores.classList.remove("hidden");
          errores.innerText=`ERROR: ${data}`
        }
      })
      .catch((err) => console.log(err)); //ACA NO LLEGA NUNCA
  }
});
