import mongoose from "mongoose";

// Definir el esquema de Opcion
const opcionSchema = new mongoose.Schema({
  texto: { type: String, required: true }, // Texto de la opción
  valor: { type: Number, required: true }, // Valor numérico asociado con la opción
  subcategoria: { 
    type: String,
    default: null // Solo es aplicable en pruebas con opciones tipo 3
  }
});

// Crear el modelo Opcio
const Opcion = mongoose.model("Opcion", opcionSchema);

export default Opcion;
