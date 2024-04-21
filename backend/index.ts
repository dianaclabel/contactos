import { serve } from "bun";
import { withCors } from "./utils/cors";

console.log("Hello via Bun!");

const contactos = [
  { id: 1, nombre: "Pablo", telefono: 1111 },
  { id: 2, nombre: "Luis", telefono: 2222 },
];

serve({
  async fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return withCors(new Response());
    }

    // GET /contactos
    if (req.method === "GET" && url.pathname === "/contactos") {
      const res = Response.json(contactos);
      return withCors(res);
    }

    // POST /agregar-contacto
    if (req.method === "POST" && url.pathname === "/agregar-contacto") {
      let nuevoContacto = await req.json();
      contactos.push(nuevoContacto);
      return withCors(new Response("Contacto creado"));
    }

    return withCors(Response.json({ message: "Not found" }, { status: 404 }));
  },
});

console.log("El servidor está corriendo en el puerto 3000");
