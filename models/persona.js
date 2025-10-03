const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Conectando a", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Conectado a MongoDB");
  })
  .catch((error) => {
    console.log("Error al conectar a MongoDB:", error.message);
  });

const personaSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Configura la opción "toJSON" del esquema.
personaSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Persona", personaSchema);
