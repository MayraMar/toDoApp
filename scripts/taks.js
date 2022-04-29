// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
//import swal from 'sweetalert2';
let token = localStorage.getItem("jwt");
if (!token) {
  location.replace("./index.html");
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
  AOS.init();

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const url = "https://ctd-fe2-todo-v2.herokuapp.com/v1";
  const btnCerrarSesion = document.querySelector("#closeApp");
  const userHtml = document.querySelector(".user-info p");
  const formCrearTarea = document.querySelector(".nueva-tarea");
  const tareasPendientes = document.querySelector(".tareas-pendientes");
  const tareasTerminadas = document.querySelector(".tareas-terminadas");
  renderizarSkeletons(2, 2);
  obtenerNombreUsuario();
  setTimeout(consultarTareas, 2000);

  //renderizarTareas();
  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener("click", function () {
    Swal.fire({
      title: "Cerrar Sesión",
      text: "¿Está seguro de que desea cerrar sesión?",
      icon: "alert",
      showCancelButton: true,
      confirmButtonText: "Si, hasta luego!",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        location.replace("./index.html");
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    fetch(`${url}/users/getMe`, {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let nombreCompleto = `${data.firstName} ${data.lastName}`;
        userHtml.innerText = nombreCompleto;
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    fetch(`${url}/tasks`, {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("tareas:", data);
        renderizarTareas(data);
        botonesCambioEstado();
        botonBorrarTarea();
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener("submit", function (event) {
    event.preventDefault();
    let tarea = document.querySelector("#nuevaTarea").value;
    let datos = {
      description: tarea,
    };
    let settings = {
      method: "POST",
      body: JSON.stringify(datos),
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("jwt"),
      },
    };
    fetch(`${url}/tasks`, settings)
      .then((response) => response.json())
      .then((data) => {
        console.log("Tarea recien creada:");
        console.log(data);
        console.log("Consultando...");
        consultarTareas();
      });
    formCrearTarea.reset();
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    tareasTerminadas.innerHTML = "";
    tareasPendientes.innerHTML = "";
    let cantFinalizadas = document.getElementById("cantidad-finalizadas");
    let contadorFinalizadas = 0;
    
    // Bele limpia previamente el contenido de cada lista
    listado.forEach((tarea) => {
      let dateCreation=dayjs(tarea.createdAt).format('ddd, DD MMM YYYY - H:mm');
      if (tarea.completed) {
        // incrementar el contador de finalizadas
        contadorFinalizadas += 1;
        tareasTerminadas.innerHTML += `<li class="tarea" data-aos="flip-up">
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <p class="timestamp">Creada el: ${dateCreation}</p>
        </div>
        <button class="change" id="${tarea.id}"><i class="fa-solid fa-rotate-left"></i></button>
        <button class="delete" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
      </li>`;
      } else {
        tareasPendientes.innerHTML += `<li class="tarea" data-aos="flip-up">
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <p class="timestamp">Creada el: ${dateCreation}</p>
        </div>
        <button class="pendiente change" id="${tarea.id}"><i class="fa-solid fa-check"></i></button>
        <button class="delete" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
      </li>`;
      }
      cantFinalizadas.innerText = contadorFinalizadas;
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */

  function botonesCambioEstado() {
    const btnCambioEstado = document.querySelectorAll(".change");

    btnCambioEstado.forEach((boton) => {
      //a cada boton le asignamos una funcionalidad
      boton.addEventListener("click", function (event) {
        console.log("Cambiando estado de tarea...");
        console.log(event);
        let fechaDone=dayjs(event.timestamp).format('ddd, DD MMM YYYY - H:mm');
        const id = this.id; //this= event.target
        //const url = `${url}/tasks/${id}`
        const payload = {};

        //segun el tipo de boton que fue clickeado, cambiamos el estado de la tarea
        if (event.target.classList.contains("pendiente")) {
          // si está completada, la paso a pendiente
          console.log("Contiene pendiente");
          payload.completed = true;
          
        } else {
          console.log("tarea nro: " + id + " NO Contiene pendiente");
          // sino, está pendiente, la paso a completada
          payload.completed = false;
         
        }

        const settingsCambio = {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-type": "application/json",
          },
          body: JSON.stringify(payload),
        };
        fetch(`${url}/tasks/${id}`, settingsCambio).then((response) => {
          console.log(
            `La tarea ${id} se ha cambiado a completed: ${payload.completed}`
          );
          console.log(response.status);
          //vuelvo a consultar las tareas actualizadas y pintarlas nuevamente en pantalla
          consultarTareas();
        });
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    const btnDelete = document.querySelectorAll(".delete");
    btnDelete.forEach((boton) => {
      boton.addEventListener("click", function (e) {
        e.preventDefault;
        //console.log(e);
        
        console.log("escuche click en borrar");
        idTarea = boton.getAttribute("id");
        // creo la confirmacion con sweet alert
        Swal.fire({
          title: "Eliminar tarea",
          text: "Está seguro de que desea eliminar la tarea?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Si, eliminar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Tarea Eliminada!", "", "success");
            fetch(`${url}/tasks/${idTarea}`, {
              method: "DELETE",

              headers: {
                accept: "application/json",
                authorization: localStorage.getItem("jwt"),
              },
            })
              .then((response) => {
                response.json();
              })
              .then((data) => {
                consultarTareas();
              });
          }
        });
      });
    });
  }
});
