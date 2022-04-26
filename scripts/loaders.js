function mostrarSpinner() {
    // Seleccionamos el body. Esto nos servirá para incorporar nuestro spinner
    // dentro de nuestro HTML.
    const body = document.querySelector("body");
    
    // Seleccionamos el formulario de registro para poder ocultarlo durante la carga
    const form = document.querySelector("form");
    
    // Creamos nuestro spinner
    const spinnerContainer = document.createElement("div");
    const spinner = document.createElement("div");
    
    // Asignamos los IDs a cada nuevo elemento, para poder manipular
    // sus estilos
    spinnerContainer.setAttribute("id", "contenedor-carga");
    spinner.setAttribute("id", "carga");
    
    // Ocultamos el formulario de registro
    form.classList.add("hidden");
    
    // Agregamos el Spinner a nuestro HTML.
    spinnerContainer.appendChild(spinner);
    body.appendChild(spinnerContainer);
    
    return;
   }            

   function ocultarSpinner() {
    // Seleccionamos el body para poder remover el spinner del HTML.
    const body = document.querySelector("body");
    
    // Seleccionamos el formulario de registro para poder mostrarlo nuevamente
    const form = document.querySelector("form");
    
    // Seleccionamos el spinner
    const spinnerContainer = document.querySelector("#contenedor-carga");
    
    // Removemos el spinner del HTML
    body.removeChild(spinnerContainer);
    
    // Quitamos la clase que oculta el formulario
    form.classList.remove("hidden");
    return;
   }    

   function renderizarSkeletons(nPending, nDone){
       const containerPending=document.querySelector(".tareas-pendientes")
       const containerDone=document.querySelector(".tareas-terminadas")

       for(i=0;i<nPending;i++){
       containerPending.innerHTML+=
       `<li class=" skeleton-container tarea">
       <div class="skeleton-card descripcion">
         <p class="skeleton-text nombre"></p>
         <p class="skeleton-text timestamp"></p>
       </div>`
    }
    for(i=0;i<nDone;i++){
        containerDone.innerHTML+=
         `<li class=" skeleton-container tarea">
         <div class="skeleton-card descripcion">
           <p class="skeleton-text nombre"></p>
           <p class="skeleton-text timestamp"></p>
         </div>`
     }
   }