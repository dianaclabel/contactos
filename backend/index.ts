import { serve } from "bun";
import { withCors } from "./utils/cors";
import { connection } from "./db.ts";
import type { RowDataPacket } from "mysql2";

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return withCors(new Response());
    }

    // #region GET /contactos
    if (req.method === "GET" && url.pathname === "/contactos") {
      try {
        const [results] = await connection.query<RowDataPacket[]>(
          "SELECT * FROM `contactos`"
        );

        return withCors(Response.json(results));
      } catch (err) {
        console.log(err);
        return withCors(new Response("Error al leer la bd", { status: 500 }));
      }
    }

    // #region GET /contacto?id=123
    if (req.method === "GET" && url.pathname === "/contacto") {
      const contactoId = url.searchParams.get("id");
      try {
        const [results] = await connection.query<RowDataPacket[]>(
          "SELECT * FROM contactos WHERE id = ?",
          [contactoId]
        );
        return withCors(Response.json(results[0]));
      } catch (err) {
        console.log(err);
        return withCors(
          new Response(`No se pudo encontrar el id ${contactoId} en la bd`, {
            status: 404,
          })
        );
      }
    }

    // #region POST /agregar-contacto
    if (req.method === "POST" && url.pathname === "/agregar-contacto") {
      const data = await req.formData();
      const nombre = data.get("nombre") as string;
      const telefono = data.get("telefono") as string;
      const id = crypto.randomUUID();

      if (telefono.length > 15) {
        return withCors(
          new Response("El telefono debe tener 15 caracteres como maximo", {
            status: 400,
          })
        );
      }

      try {
        await connection.query(
          "INSERT INTO contactos (id, nombre, telefono) VALUES (?, ?, ?)",
          [id, nombre, telefono]
        );
        return withCors(new Response("Contacto creado", { status: 201 }));
      } catch (error) {
        console.error(error);
        return withCors(
          new Response("Error en la consulta hacia la bd", { status: 500 })
        );
      }
    }

    // #region PUT /editar-contacto?id=bbbb  recibe FormData
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

      if (telefono.length > 15) {
        return withCors(
          new Response("El telefono debe tener 15 caracteres como maximo", {
            status: 400,
          })
        );
      }

      try {
        await connection.query(
          "UPDATE contactos SET  nombre = ? , telefono = ? WHERE id = ? ",
          [nombre, telefono, id]
        );
        return withCors(new Response("Contacto editado", { status: 200 }));
      } catch (error) {
        console.log(error);
        return withCors(
          new Response("Error en la edición de bd", { status: 500 })
        );
      }
    }

    // #region DELETE /borrar-contacto?contacto-id=123
    if (req.method === "DELETE" && url.pathname === "/borrar-contacto") {
      const contactoId = url.searchParams.get("contacto-id");

      if (!contactoId) {
        return withCors(
          new Response("El id en el parámetro es requerido", { status: 400 })
        );
      }

      try {
        await connection.query("DELETE FROM contactos  WHERE id = ? ", [
          contactoId,
        ]);
        return withCors(new Response("Contacto eliminado", { status: 204 }));
      } catch (error) {
        console.log(error);
        return withCors(
          new Response("Error al intentar eliminar el contacto de la bd", {
            status: 500,
          })
        );
      }
    }

    return withCors(Response.json({ message: "Not found" }, { status: 404 }));
  },
});

console.log("El servidor está corriendo en el puerto 3000");
