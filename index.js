const express = require("express");
const app = express();
//Importamos el módulo morgan para el registro de solicitudes HTTP.
const morgan = require("morgan");
const cors = require("cors");

let personas = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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

// Ruta que devuelve los datos codificados en JSON.
app.get("/api/persons", (request, response) => {
  response.json(personas);
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
  // Si el nombre ya existe en la agenda...
  if (personas.find((p) => p.name === nuevaPersona.name)) {
    return response.status(409).json({
      error: "El campo 'name' debe ser único",
    });
  }

  const id = Math.floor(Math.random() * 1000000);

  const persona = {
    name: nuevaPersona.name,
    number: nuevaPersona.number,
    id: id,
  };

  // Luego de armar el objeto "persona" se lo concatena al array "personas".
  personas = personas.concat(persona);

  // Se devuelve la persona recién agregada.
  response.json(persona);
});

// Render asigna el puerto a través de una variable de entorno, por lo tanto usará process.env.PUERTO.
const PUERTO = process.env.PUERTO || 3001; 
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en: http://localhost:${PUERTO}`);
});
