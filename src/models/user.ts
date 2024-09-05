import mongoose, { Schema, Document, model, models } from "mongoose";

// Definir la interfaz del esquema
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  creationDate: Date;
  phone: string;
  currentSchool: string;
  educationLevel: string;
  generation: string;
  grade: string;
  group: string;
  updateDate: Date;
}

// Definir el esquema de Mongoose
const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, // Validar el email
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "User",
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    phone: {
      type: String,
      required: true,
      maxlength: 10,
    },
    currentSchool: {
      type: String,
    },
    educationLevel: {
      type: String,
    },
    generation: {
      type: String,
    },
    grade: {
      type: String,
    },
    group: {
      type: String,
    },
    updateDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Verificar si el modelo ya está definido antes de compilarlo
const User = models.User || model<IUser>("User", UserSchema);

export default User;
