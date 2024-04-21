import { setCors } from "./utils/cors";

console.log("Hello via Bun!");

const contactos = [
  { id: 1, nombre: "Pablo", telefono: 1111 },
  { id: 2, nombre: "Luis", telefono: 2222 },
];

Bun.serve({
  fetch(req) {
    console.log(req);

    const url = new URL(req.url);

    // GET /contactos
    if (req.method === "GET" && url.pathname === "/contactos") {
      const res = new Response(JSON.stringify(contactos), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return setCors(res);
    }

    // GET /contactos
    if (req.method === "GET" && url.pathname === "/perrito") {
      const res = new Response(JSON.stringify({ name: "perritu!!" }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return setCors(res);
    }

    console.log(url);

    return new Response("Bun!");
  },
});
