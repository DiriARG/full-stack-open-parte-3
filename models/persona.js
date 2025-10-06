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
    console.log("Error al conectar a MongoDB: ", error.message);
  });

const personaSchema = new mongoose.Schema({
  name: {
    type: String,
    // Se agrega una restricción mínima de tres caracteres de longitud para el nombre.
    minlength: [3, "El nombre debe tener al menos 3 caracteres de longitud."],
    required: [true, "El nombre es obligatorio."],
  },
  number: {
    type: String,
    minlength: [8, "El número debe tener al menos 8 caracteres de longitud."],
    required: [true, "El número es obligatorio."],
    validate: {
      validator: function (valor) {
        // Para tener el formato "xx-xxxxxxx" o "xxx-xxxxxxxx".
        return /^\d{2,3}-\d+$/.test(valor);
      },
      message:
        "El número debe tener el formato correcto (ej: 09-1234567 o 040-22334455).",
    },
  },
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
