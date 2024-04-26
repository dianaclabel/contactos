import { serve } from "bun";
import { withCors } from "./utils/cors";

console.log("Hello via Bun!");

let contactos = [
  { id: "aaaa", nombre: "Pablo", telefono: "1111" },
  { id: "bbbb", nombre: "Luis", telefono: "2222" },
];

serve({
  async fetch(req) {
    const url = new URL(req.url);
    console.log(req, url);

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return withCors(new Response());
    }

    // GET /contactos
    if (req.method === "GET" && url.pathname === "/contactos") {
      const res = Response.json(contactos);
      return withCors(res);
    }

    // GET /contacto?id=123
    if (req.method === "GET" && url.pathname === "/contacto") {
      const contactoId = url.searchParams.get("id");
      const contacto = contactos.find((c) => c.id === contactoId);
      return withCors(Response.json(contacto, { status: 404 }));
    }

    // POST /agregar-contacto
    if (req.method === "POST" && url.pathname === "/agregar-contacto") {
      const data = await req.formData();
      const nombre = data.get("nombre") as string;
      const telefono = data.get("telefono") as string;
      const id = crypto.randomUUID();
      contactos.push({ nombre, telefono, id });
      return withCors(new Response("Contacto creado", { status: 201 }));
    }

    // DELETE /borrar-contacto?contacto-id=123
    if (req.method === "DELETE" && url.pathname === "/borrar-contacto") {
      const contactoId = url.searchParams.get("contacto-id");
      contactos = contactos.filter((e) => e.id != contactoId);
      return withCors(new Response("Contacto eliminado", { status: 204 }));
    }

    // PUT /editar-contacto?id=bbbb  recibe FormData
    if (req.method === "PUT" && url.pathname === "/editar-contacto") {
      const data = await req.formData();
      const nombre = data.get("nombre") as string;
      const telefono = data.get("telefono") as string;
      const id = url.searchParams.get("id");

      if (!id) {
        return withCors(
          new Response("El id en el parámetro es requerido", { status: 400 })
        );
      }

      const idx = contactos.findIndex((c) => c.id === id);
      contactos[idx] = { id, nombre, telefono };

      return withCors(new Response("Contacto editado"));
    }

    return withCors(Response.json({ message: "Not found" }, { status: 404 }));
  },
});

console.log("El servidor está corriendo en el puerto 3000");
