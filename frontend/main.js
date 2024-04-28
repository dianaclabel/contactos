const isLocal = ["localhost", "127.0.0.1"].some((h) => h === location.hostname);
const isProd = !isLocal;

const backendBaseURL = isProd
  ? "https://api.contactos.apps.dianaclabel.com"
  : "http://localhost:3000";

const tBodyElement = document.getElementById("tbody-contactos");
const btnCargarContactos = document.getElementById("btn-cargar-contactos");
const btnAgregarContacto = document.getElementById("btn-agregar-contacto");
const dialogContacto = document.getElementById("dialog-contacto");
const btnCancelar = document.getElementById("btn-cancelar");
const formContacto = document.getElementById("form-contacto");
const iconCloseForm = document.getElementById("icon-close-form");
const tituloDialog = document.getElementById("titulo-dialog");

/** @type {HTMLInputElement} */
const inputNombre = document.getElementById("input-nombre");

const inputTelefono = document.getElementById("input-telefono");

let contactos = [];

/** @type {"crear" | "editar"} */
let modoFormulario = "crear";

let contactoActualID;

btnCargarContactos.addEventListener("click", cargarContactos);
btnAgregarContacto.addEventListener("click", () => {
  modoFormulario = "crear";
  mostrarDialog(modoFormulario);
});
btnCancelar.addEventListener("click", cerrarDialog);
formContacto.addEventListener("submit", manejarContacto);
iconCloseForm.addEventListener("click", cerrarDialog);

cargarContactos();

//GET
async function cargarContactos() {
  const req = new Request(backendBaseURL + "/contactos");
  const res = await fetch(req);
  const data = await res.json();
  contactos = data;
  refrescarTabla();
}

function refrescarTabla() {
  tBodyElement.innerHTML = "";

  for (let i = 0; i < contactos.length; i++) {
    const contacto = contactos[i];

    let trElement = document.createElement("tr");

    let titlePropiedades = ["nombre", "telefono"];

    const tdElementNum = document.createElement("td");
    tdElementNum.innerText = i + 1;
    trElement.appendChild(tdElementNum);

    for (let j = 0; j < titlePropiedades.length; j++) {
      const tdElement = document.createElement("td");
      tdElement.innerText = contacto[titlePropiedades[j]];
      trElement.appendChild(tdElement);
    }

    const tdAcciones = document.createElement("td");

    const btnBorrar = document.createElement("button");
    btnBorrar.innerHTML = "Borrar";
    btnBorrar.classList.add("btnDelete");
    btnBorrar.addEventListener("click", () => borrarContacto(contacto));

    const btnEditar = document.createElement("button");
    btnEditar.innerHTML = "Editar";
    btnEditar.classList.add("btnEditar");
    btnEditar.addEventListener("click", () => {
      contactoActualID = contacto.id;
      modoFormulario = "editar";
      inputNombre.value = contacto.nombre;
      inputTelefono.value = contacto.telefono;
      mostrarDialog(modoFormulario);
    });

    tdAcciones.appendChild(btnBorrar);
    tdAcciones.appendChild(btnEditar);

    trElement.appendChild(tdAcciones);

    tBodyElement.appendChild(trElement);
  }
}

async function manejarContacto(event) {
  event.preventDefault();

  // TODO if modo

  if (modoFormulario === "crear") {
    const req = new Request(backendBaseURL + "/agregar-contacto", {
      method: "POST",
      body: new FormData(formContacto),
    });

    const res = await fetch(req);
    if (res.status === 201) {
      const successMessage = await res.text();
      alert(successMessage);
    }

    if (res.status === 400 || res.status === 500) {
      const errorMessage = await res.text();
      alert(errorMessage);
      return;
    }
  }

  if (modoFormulario === "editar") {
    const url = new URL(backendBaseURL + "/editar-contacto");
    url.searchParams.set("id", contactoActualID);
    const req = new Request(url, {
      method: "PUT",
      body: new FormData(formContacto),
    });

    await fetch(req);
  }

  cargarContactos();
  formContacto.reset();
  cerrarDialog();
}

async function borrarContacto(contacto) {
  const url = new URL(backendBaseURL + "/borrar-contacto");
  url.searchParams.set("contacto-id", contacto.id);
  const req = new Request(url, { method: "DELETE" });
  await fetch(req);
  cargarContactos();
}

function mostrarDialog(modo) {
  if (modo === "crear") {
    formContacto.reset();
    tituloDialog.innerHTML = "Nuevo Contacto";
    dialogContacto.showModal();
  }

  if (modo === "editar") {
    tituloDialog.innerHTML = "Editar Contacto";
    dialogContacto.showModal();
  }
}

function cerrarDialog() {
  dialogContacto.close();
}
