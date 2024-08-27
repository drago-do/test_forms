import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Define el esquema de usuario
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
  },
  password: { type: String, required: true }, // Cambiado a String para contraseñas
  role: { type: String, required: true, default: 'User' }, // Campo para rol
  creationDate: { type: Date, default: Date.now },
  phone: { type: String, required: true, maxlength: 10 }, // Campo para teléfono con max 10 caracteres
  currentSchool: { type: String },
  educationLevel: { type: String },
  generation: { type: String },
  grade: { type: String },
  group: { type: String },
  updateDate: { type: Date, default: Date.now },
});

// Exporta el modelo
const User = mongoose.model('User', userSchema);

// Configura la conexión a MongoDB usando una variable de entorno
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

export default User;
