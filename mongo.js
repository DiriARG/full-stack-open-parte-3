const mongoose = require("mongoose");

// Verificación de los argumentos recibidos desde la línea de comandos.
if (process.argv.length < 3) {
  console.log(
    "Por favor, proporciona los siguientes argumentos para agregar a una persona: "
  );
  console.log("  node mongo.js <contraseña> [nombre] [numero]");
  console.log(
    "Si quieres visualizar todos los contactos de la agenda, escribá lo siguiente: "
  );
  console.log("  node mongo.js <contraseña>");
  process.exit(1);
}

// Obtención de parámetros.
const contraseña = process.argv[2];
const nombre = process.argv[3];
const numero = process.argv[4];

// Cadena de conexión a MongoDB Atlas.
const url = `mongodb+srv://matidirisio:${contraseña}@cluster0.vw2yocc.mongodb.net/agendatelefonicaApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
// Conexión con MongoDB Atlas.
mongoose.connect(url);

// Definición del esquema y el modelo.
const personaSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Persona = mongoose.model("Persona", personaSchema);

// Si se pasan solo 3 argumentos (node / mongo.js / contraseña) → Se listan todos los contactos.
if (process.argv.length === 3) {
  Persona.find({}).then((personas) => {
    console.log("Agenda telefónica: ");
    personas.forEach((persona) => {
      console.log(`${persona.name} ${persona.number}`);
    });
    mongoose.connection.close();
  });

  // Si se pasan 5 argumentos (node / mongo.js / contraseña / nombre / numero) → Se agrega una nueva persona.
} else if (process.argv.length === 5) {
  const persona = new Persona({
    name: nombre,
    number: numero,
  });

  persona.save().then(() => {
    console.log(
      `Se agregó a ${nombre} con el número ${numero} a la agenda telefónica`
    );
    mongoose.connection.close();
  });

  // Cualquier otro caso...
} else {
  console.log("Formato incorrecto. Por favor, revisa los ejemplos: ");
  console.log("  node mongo.js <contraseña>");
  console.log("  node mongo.js <contraseña> Anna 040-1234556");
  mongoose.connection.close();
}
