import mongoose from "mongoose";

// Definir el esquema de Pregunta
const preguntaSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  opciones: {
    type: String,
    enum: ['opcion_multiple', 'verdadero_falso', 'escala'], // Define los tipos de opciones
    required: true
  },
  respuestas_correctas: {
    type: [String], // Array de índices de opciones correctas
    validate: [array => array.length > 0, 'Debe haber al menos una respuesta correcta']
  },
  valor_maximo_individual: {
    type: Number,
    min: 0,
    required: function() {
      return this.opciones === 'opcion_multiple' || this.opciones === 'verdadero_falso'; // Solo necesario para opciones múltiples o verdadero/falso
    }
  }
});

// Crear el modelo Pregunta
const Pregunta = mongoose.model("Pregunta", preguntaSchema);

export default Pregunta;

