import mongoose from "mongoose";

// Definir el esquema de Pregunta
const preguntaSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  opciones: [{ type: String }], // Opciones para preguntas de tipo múltiple, si es necesario
  respuestaCorrecta: { type: String } // Respuesta correcta para preguntas de opción única
});

// Crear el modelo Pregunta
const Pregunta = mongoose.model("Pregunta", preguntaSchema);

// Definir el esquema de Sección
const seccionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  vinculo: [{ type: String }], // Array de enlaces a cuestionarios relevantes, bases de datos, etc.
  valorMaximo: { type: Number, required: true },
  preguntas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pregunta' }] // Referencia al modelo de Pregunta
});

// Crear el modelo Sección
const Seccion = mongoose.model("Seccion", seccionSchema);

export { Pregunta, Seccion };
