import mongoose, { Schema, Document, model, models } from "mongoose";

// Definir tipos de nivel educativo
export enum NivelEducativo {
  BACHILLERATO_TECNOLOGICO = "Bachillerato Tecnológico",
  UNIVERSIDAD = "Universidad",
  POSGRADO = "Posgrado",
}

// Interfaz para el modelo de Carrera
export interface ICarrera extends Document {
  nombre: string;
  nivelEducativo: NivelEducativo;
  areaAcademica: string;
  foto: string; // URL de la imagen de la carrera
  videoPrincipal: string; // Video principal en YouTube
  videosExperiencia: string[]; // Máximo 3 videos
  textosInformativos: {
    comoAyudaAlMundo: string;
    interesesYHabilidades: string;
    conocimientosTecnicos: string;
    dondePuedoTrabajar: string;
    competenciasAlTerminar: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean; // Campo para eliminación lógica
}

// Esquema de Mongoose
const CarreraSchema = new Schema<ICarrera>(
  {
    nombre: { type: String, required: true, unique: true },
    nivelEducativo: {
      type: String,
      enum: Object.values(NivelEducativo),
      required: true,
    },
    areaAcademica: { type: String, required: true },
    foto: { type: String, default: "" },
    videoPrincipal: { type: String, default: "" },
    videosExperiencia: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 3,
        "Máximo 3 videos permitidos",
      ],
    },
    textosInformativos: {
      comoAyudaAlMundo: { type: String, default: "" },
      interesesYHabilidades: { type: String, default: "" },
      conocimientosTecnicos: { type: String, default: "" },
      dondePuedoTrabajar: { type: String, default: "" },
      competenciasAlTerminar: { type: String, default: "" },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Verificar si el modelo ya está definido antes de compilarlo
export const Carrera =
  models.Carrera || model<ICarrera>("Carrera", CarreraSchema);
