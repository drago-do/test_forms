import { NextResponse } from "next/server";
import { Prueba } from "../../../../../models/testing";
import mongodb from "../../../../../lib/mongodb";

// Metodo GET

// Obtener un documento por su ID y tipo
export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    // Conexión a MongoDB
    await mongodb();

    const { type } = params;

    // Intentar buscar el documento por su ID y tipo
    const documento = await Prueba.find({ tipo: type })
      .select("titulo descripcion ")
      .exec();

    // Si no encuentra el documento, devolver error
    if (!documento) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Document not found",
      });
    }

    // Devolver el documento encontrado
    return NextResponse.json({
      success: true,
      data: documento,
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
