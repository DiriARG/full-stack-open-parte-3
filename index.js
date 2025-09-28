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
app.get('/api/persons', (request, response) => {
  response.json(personas)
})

const PUERTO = 3001;
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en: http://localhost:${PUERTO}`);
  
});