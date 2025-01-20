import { NextResponse } from "next/server";
import Prueba, { IPrueba } from "../../../models/testing";
import mongodb from "../../../lib/mongodb";
import mongoose from "mongoose";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Metodo POST

// Crear un nuevo documento dependiendo del tipo de recurso
export async function POST(request: Request) {
  try {
    await mongodb();
    const data = await request.json();
    console.log(data);
    const newDocument = new Prueba(data);

    const savedDocument = await newDocument.save();
    return NextResponse.json({
      success: true,
      data: savedDocument,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor",
      message: error.message,
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Metodo GET

// Obtener todos los documentos del recurso con paginación
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // Página actual, por defecto 1
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Límite de documentos por página, por defecto 10
  const skip = (page - 1) * limit; // Calcular cuántos documentos saltar

  try {
    await mongodb();
    const documentos: IPrueba[] = await (Prueba as mongoose.Model<IPrueba>)
      .find({ eliminado: false }) // Filtrar las pruebas que no han sido eliminadas
      .skip(skip)
      .limit(limit)
      .exec();
    const totalDocumentos = await Prueba.countDocuments({ eliminado: false }); // Contar solo los documentos no eliminados

    return NextResponse.json({
      success: true,
      data: documentos,
      total: totalDocumentos,
      page,
      totalPages: Math.ceil(totalDocumentos / limit),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor",
      message: error.message,
    });
  }
}
