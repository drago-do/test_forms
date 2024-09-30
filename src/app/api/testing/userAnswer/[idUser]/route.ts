import { NextResponse } from "next/server";
import Resultados from "../../../../../models/results";
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
    console.log(idUser);

    // Intentar buscar los documentos resueltos por el usuario
    const documentos = await Resultados.find({ id_user: idUser })
      .populate({
        path: "id_prueba",
        select: "escalas titulo descripcion instrucciones tipo",
      })
      .exec();

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
