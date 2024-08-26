import mongoose from "mongoose";

// Definir el esquema de Sección
const seccionSchema = new mongoose.Schema({
  // Define los campos de tu esquema de sección aquí
  // Por ejemplo:
  nombre: { type: String, required: true },
  descripcion: { type: String }
});

// Definir el esquema de Prueba
const pruebaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  tipo: { type: String, required: true },
  escalas: {
    nivel: { type: Number, required: true },
    escala: [{ type: String }]
  },
  secciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seccion' }], // Referencia al modelo de Sección
  creado_por: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ajusta esto si el modelo de usuarios tiene otro nombre
    required: true
  },
  fecha_creacion: { type: Date, default: Date.now }
});

// Exportar el modelo
export default mongoose.model("Prueba", pruebaSchema);
