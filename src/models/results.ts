import mongoose, { Schema, Document, model, models } from "mongoose";

//Results
export interface IResultados extends Document {
  id_prueba: mongoose.Schema.Types.ObjectId;
  id_user: mongoose.Schema.Types.ObjectId;
  respuestas: Map<string, string>;
}

//Definir el esquema de Mongoose
const ResultadosSchema: Schema<IResultados> = new Schema(
  {
    id_prueba: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prueba",
      required: true,
    },
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    respuestas: {
      type: Map,
      of: {
        type: String,
        required: true,
      },
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Verificar si el modelo ya está definido antes de compilarlo
const Resultados =
  models.Resultados || model<IResultados>("Resultados", ResultadosSchema);

export default Resultados;
