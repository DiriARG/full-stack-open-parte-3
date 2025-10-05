// Carga las variables del ".env" globalmente. Debe ir antes de cualquier importación que las use (ej: "./models/persona").
require("dotenv").config();
const express = require("express");
//Importamos el módulo morgan para el registro de solicitudes HTTP.
const morgan = require("morgan");
const cors = require("cors");

const Persona = require("./models/persona");

const app = express();

// Función centralizada para manejar errores de Express.
const controladorDeErrores = (error, request, response, next) => {
  console.error(error.message);

  // "CastError" ocurre cuando el ID proporcionado tiene un formato incorrecto para MongoDB.
  if (error.name === "CastError") {
    return response.status(400).send({ error: "ID con formato incorrecto" });
  }

  next(error);
};

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
app.get("/info", (request, response, next) => {
  // Se cuenta todos los registros de la colección.
  Persona.countDocuments({})
    .then((cantidad) => {
      // Fecha y hora actual.
      const fecha = new Date();
      response.send(`
        <p>La agenda telefónica tiene información de ${cantidad} personas</p>
        <p>${fecha}</p>
      `);
    })
    .catch((error) => next(error));
});

// Ruta que devuelve los datos de una persona segun su id.
app.get("/api/persons/:id", (request, response, next) => {
  Persona.findById(request.params.id)
    .then((persona) => {
      if (persona) {
        response.json(persona);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error)); 
});

// Ruta para eliminar una persona segun su id.
app.delete("/api/persons/:id", (request, response, next) => {
  Persona.findByIdAndDelete(request.params.id)
    .then((resultado) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Ruta para agregar nuevas personas a la agenda telefónica.
app.post("/api/persons", (request, response, next) => {
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
  persona
    .save()
    .then((personaGuardada) => {
      response.status(201).json(personaGuardada);
    })
    .catch((error) => next(error));
});

// Ruta para actualizar una persona existente mediante su id.
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  // Se busca el ID en la bd.
  Persona.findById(request.params.id)
    .then((persona) => {
      if (!persona) {
        return response.status(404).end();
      }

      // Se editan los campos del documento Mongoose.
      persona.name = name;
      persona.number = number;

      // Por ultimo, se guarda el documento actualizado.
      return persona.save().then((personaActualizada) => {
        response.json(personaActualizada);
      });
    })
    .catch((error) => next(error));
});

// Uso del middleware de manejo de errores, siempre debe estar al final.
app.use(controladorDeErrores);

// Render asigna el puerto a través de una variable de entorno, por lo tanto usará process.env.PORT.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});
