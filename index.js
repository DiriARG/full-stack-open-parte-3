const express = require('express')
const app = express()

let personas = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
]

app.use(express.json())

// Ruta principal.
app.get("/", (request, response) =>{
    response.send("<h1>Backend de la Agenda Telefónica!</h1>")
})

// Ruta que devuelve los datos codificados en JSON.
app.get("/api/persons", (request, response) => {
  response.json(personas)
})

// Ruta que proporciona info. 
app.get("/info", (request, response) => {
  const total = personas.length;
  // Fecha y hora actual.
  const fecha = new Date();
  response.send(`<p>La agenda telefónica tiene información de ${total} personas </p>
    <p>${fecha}</p>`)
})

// Ruta que devuelve los datos de una persona segun su id.
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id) // "request.params.id" siempre llega como una cadena (string), por lo tanto, es necesario convertirlo a un número (number).
  const persona = personas.find((persona) => persona.id === id)

  if (persona) {
    response.json(persona)
  } else {
    response.status(404).end()
  }
})

const PUERTO = 3001;
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en: http://localhost:${PUERTO}`);
  
});