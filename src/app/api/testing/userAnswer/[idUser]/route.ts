import { NextResponse } from "next/server";
import Resultados, { IResultados } from "../../../../../models/results";
import { Prueba } from "../../../../../models/testing";
import mongodb from "../../../../../lib/mongodb";

// Metodo GET

// Obtener los tests resueltos por el usuario
export async function GET(
  request: Request,
  { params }: { params: { idUser: string } }
) {
  try {
    // Conexión a MongoDB
    await mongodb();

    const { idUser } = params;

    // Intentar buscar los documentos resueltos por el usuario
    const documentos: IResultados[] = await Resultados.find({
      id_user: idUser,
    }).populate({
      path: "id_prueba",
      model: Prueba,
      select: "escalas titulo descripcion instrucciones tipo",
    });

    // Si no encuentra los documentos, devolver error
    if (!documentos || documentos.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "No resolved tests found for the user",
      });
    }

    // Devolver los documentos encontrados
    return NextResponse.json({
      success: true,
      data: documentos,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
