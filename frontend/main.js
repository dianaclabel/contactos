const tBodyElement = document.getElementById("tbody-contactos");
const btnCargarContactos = document.getElementById("btn-cargar-contactos");
const btnAgregarContacto = document.getElementById("btn-agregar-contacto");
const dialogNuevoContacto = document.getElementById("dialog-nuevo-contacto");
const btnCancelar = document.getElementById("btn-cancelar");
const formContactoNuevo = document.getElementById("form-nuevo-contacto");
const iconCloseForm = document.getElementById("icon-close-form");

let contactos = [];

btnCargarContactos.addEventListener("click", cargarContactos);
btnAgregarContacto.addEventListener("click", mostrarDialog);
btnCancelar.addEventListener("click", cerrarDialog);
formContactoNuevo.addEventListener("submit", manejarNuevoContacto);
iconCloseForm.addEventListener("click", cerrarDialog);

cargarContactos();

async function cargarContactos() {
  const req = new Request("http://localhost:3000/contactos");
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

    const tdBtnBorrar = document.createElement("td");

    const btnBorrar = document.createElement("button");
    btnBorrar.innerHTML = "Borrar";
    btnBorrar.classList.add("btnDelete");
    btnBorrar.addEventListener("click", () => borrarContacto(contacto));

    tdBtnBorrar.appendChild(btnBorrar);
    trElement.appendChild(tdBtnBorrar);

    tBodyElement.appendChild(trElement);
  }
}

// const data = new FormData(formContactoNuevo);
// const nombre = data.get("nombre");
// const telefono = data.get("telefono");
// const nuevoContacto = { nombre, telefono };

// const req = new Request("http://localhost:3000/agregar-contacto", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(nuevoContacto),
// });

async function manejarNuevoContacto(event) {
  event.preventDefault();

  const req = new Request("http://localhost:3000/agregar-contacto", {
    method: "POST",
    body: new FormData(formContactoNuevo),
  });

  await fetch(req);

  cargarContactos();
  formContactoNuevo.reset();
  cerrarDialog();
}

async function borrarContacto(contacto) {
  const url = new URL("http://localhost:3000/borrar-contacto");
  url.searchParams.set("contacto-id", contacto.id);
  const req = new Request(url, { method: "DELETE" });
  await fetch(req);
  cargarContactos();
}

function mostrarDialog() {
  dialogNuevoContacto.showModal();
}

function cerrarDialog() {
  dialogNuevoContacto.close();
}
