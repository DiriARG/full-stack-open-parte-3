// Carga las variables del ".env" globalmente. Debe ir antes de cualquier importación que las use (ej: "./models/persona").
require("dotenv").config();
const express = require("express");
//Importamos el módulo morgan para el registro de solicitudes HTTP.
const morgan = require("morgan");
const cors = require("cors");

const Persona = require("./models/persona");

const app = express();

let personas = [];

// Middleware para servir el frontend estático.
app.use(express.static("dist"));
app.use(express.json());
// Se habilita CORS para todas las solicitudes.
app.use(cors());

// Se define un token personalizado para mostrar el body.
morgan.token("body", (req) => JSON.stringify(req.body));

// Formato tiny + mostrar body solo en caso de POST.
app.use(
  morgan((tokens, req, res) => {
    const log = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");

    // Si es un POST, agregamos el body.
    return req.method === "POST" ? `${log} ${tokens.body(req, res)}` : log;
  })
);

// Ruta principal.
app.get("/", (request, response) => {
  response.send("<h1>Backend de la Agenda Telefónica!</h1>");
});

// Ruta para obtener todos los contactos de la agenda telefónica.
app.get("/api/persons", (request, response) => {
  Persona.find({}).then((personas) => {
    response.json(personas);
  });
});

// Ruta que proporciona info.
app.get("/info", (request, response) => {
  const total = personas.length;
  // Fecha y hora actual.
  const fecha = new Date();
  response.send(`<p>La agenda telefónica tiene información de ${total} personas </p>
    <p>${fecha}</p>`);
});

// Ruta que devuelve los datos de una persona segun su id.
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id); // "request.params.id" siempre llega como una cadena (string), por lo tanto, es necesario convertirlo a un número (number).
  const persona = personas.find((persona) => persona.id === id);

  if (persona) {
    response.json(persona);
  } else {
    response.status(404).end();
  }
});

// Ruta para eliminar una persona segun su id.
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  personas = personas.filter((persona) => persona.id !== id);

  response.status(204).end();
});

// Ruta para agregar nuevas personas a la agenda telefónica.
app.post("/api/persons", (request, response) => {
  const nuevaPersona = request.body;

  // Si falta el nombre o el número...
  if (!nuevaPersona.name || !nuevaPersona.number) {
    return response.status(400).json({
      error: "Falta el nombre o el número",
    });
  }
  
  // Se crea la instancia de Mongoose (el ID se generará automáticamente).
  const persona = new Persona({
    name: nuevaPersona.name,
    number: nuevaPersona.number,
  });
  
  // Se guarda en la bd.
  persona.save().then((personaGuardada) => {
    response.json(personaGuardada);
  });
});

// Render asigna el puerto a través de una variable de entorno, por lo tanto usará process.env.PORT.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});
