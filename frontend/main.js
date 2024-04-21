const tBodyElement = document.getElementById("tbody-contactos");
const btnCargarContactos = document.getElementById("btn-cargar-contactos");
const btnLimpiar = document.getElementById("btn-limpiar");
const btnAgregarContacto = document.getElementById("btn-agregar-contacto");
const dialogNuevoContacto = document.getElementById("dialog-nuevo-contacto");
const btnCancelar = document.getElementById("btn-cancelar");
const formContactoNuevo = document.getElementById("form-nuevo-contacto");

let contactos = [];

btnCargarContactos.addEventListener("click", refrescarTabla);
btnLimpiar.addEventListener("click", limpiar);
btnAgregarContacto.addEventListener("click", mostrarDialog);
btnCancelar.addEventListener("click", cerrarDialog);
formContactoNuevo.addEventListener("submit", manejarNuevoContacto);

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
    let trElement = document.createElement("tr");

    let titlePropiedades = ["nombre", "telefono"];

    const tdElement = document.createElement("td");
    tdElement.innerText = i + 1;
    trElement.appendChild(tdElement);

    for (let j = 0; j < titlePropiedades.length; j++) {
      const tdElement = document.createElement("td");
      tdElement.innerText = contactos[i][titlePropiedades[j]];
      trElement.appendChild(tdElement);
    }

    tBodyElement.appendChild(trElement);
  }
}

function limpiar() {
  tBodyElement.innerHTML = "";
}

async function manejarNuevoContacto(event) {
  event.preventDefault();

  const data = new FormData(formContactoNuevo);
  const nombre = data.get("nombre");
  const telefono = data.get("telefono");
  const id = crypto.randomUUID();
  const nuevoContacto = { id, nombre, telefono };

  const req = new Request("http://localhost:3000/agregar-contacto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoContacto),
  });

  await fetch(req);

  cargarContactos();

  formContactoNuevo.reset();
  cerrarDialog();
}

function mostrarDialog() {
  dialogNuevoContacto.showModal();
}

function cerrarDialog() {
  dialogNuevoContacto.close();
}
