import { NextResponse } from "next/server";
import mongodb from "../../../../../lib/mongodb";
import { Prueba as PruebaModel, IPrueba } from "../../../../../models/testing";
import mongoose from "mongoose";

// Metodo GET

// Obtener un documento por su tipo
export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    // Conexión a MongoDB
    await mongodb();

    const { type } = params;

    // Intentar buscar el documento por su tipo
    const documentos: IPrueba[] = await (PruebaModel as mongoose.Model<IPrueba>)
      .find({ tipo: parseInt(type) })
      .select("titulo descripcion")
      .exec();

    // Si no encuentra documentos, devolver error
    if (documentos.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Documents not found",
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
