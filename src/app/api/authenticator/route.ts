import { NextResponse } from "next/server";
import User, { IUser } from "../../../models/user";
import mongodb from "../../../lib/mongodb";
import mongoose from "mongoose";

// Función para manejar la solicitud POST
export async function POST(request: Request) {
  try {
    // Conectar a MongoDB
    await mongodb();

    // Extraer el cuerpo de la solicitud
    const { email, password } = await request.json();

    // Verificar que ambos campos estén presentes y que password sea una cadena
    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos y deben ser cadenas." },
        { status: 400 }
      );
    }

    // Buscar el usuario por email
    const user: IUser = await (User as mongoose.Model<IUser>).findOne({
      email: email,
    });
    console.log("Usuario encontrado:", user);

    // Si no se encuentra el usuario, devolver un error
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado o credenciales incorrectas." },
        { status: 404 }
      );
    }

    // Verificar la contraseña (en texto claro, solo para demostración)
    if (password !== user.password) {
      return NextResponse.json(
        { error: "Usuario no encontrado o credenciales incorrectas." },
        { status: 401 }
      );
    }

    // Devolver toda la información del usuario
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
