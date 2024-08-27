import mongoose, { Schema, Document, model, models } from 'mongoose';

// Definir la interfaz del documento
export interface IUser extends Document {
  name: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Definir el esquema de Mongoose
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Crea automáticamente los campos createdAt y updatedAt
  }
);

// Verificar si el modelo ya está definido antes de compilarlo
const User = models.User || model<IUser>('User', UserSchema);

export default User;
