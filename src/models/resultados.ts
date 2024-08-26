import mongoose from "mongoose";

// Definir el esquema de Resultados
const resultadosSchema = new mongoose.Schema({
  id_prueba: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prueba', // Nombre del modelo de Prueba
    required: true
  },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Nombre del modelo de User
    required: true
  },
  respuestas: {
    type: Map,
    of: Number, // Mapa de respuestas con valores numéricos
    default: {}
  }
}, {
  timestamps: true // Agrega campos de fecha de creación y actualización
});

// Crear el modelo Resultados
const Resultados = mongoose.model("Resultados", resultadosSchema);

export default Resultados;
