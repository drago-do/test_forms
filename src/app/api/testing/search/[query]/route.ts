import { NextResponse } from "next/server";
import Prueba, { IPrueba } from "../../../../../models/testing";
import mongodb from "../../../../../lib/mongodb";
import mongoose from "mongoose";
// Endpoint GET para buscar por título o descripción con paginación
export async function GET(
  request: Request,
  { params }: { params: { query: string } }
) {
  try {
    // Conexión a MongoDB
    await mongodb();

    const { query } = params;
    const regex = new RegExp(query, "i");

    // Parámetros de paginación
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    // Calcular el número de documentos a saltar
    const skip = (page - 1) * limit;

    // Buscar documentos donde el título o descripción coincidan con la expresión regular
    const documentos: IPrueba[] = await (Prueba as mongoose.Model<IPrueba>)
      .find({
        $or: [
          { titulo: { $regex: regex } },
          { descripcion: { $regex: regex } },
        ],
      })
      .skip(skip)
      .limit(limit)
      .exec();

    // Contar el total de documentos para la paginación
    const totalDocumentos = await Prueba.countDocuments({
      $or: [{ titulo: { $regex: regex } }, { descripcion: { $regex: regex } }],
    }).exec();

    // Calcular el número total de páginas
    const totalPages = Math.ceil(totalDocumentos / limit);

    // Si no encuentra documentos, devolver un mensaje de error
    if (documentos.length === 0) {
      return NextResponse.json({
        error: "Not Found",
        message: "No se encontraron documentos que coincidan con la búsqueda",
      });
    }

    // Devolver los documentos encontrados junto con la información de paginación
    return NextResponse.json({
      documentos,
      pagination: {
        totalDocumentos,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
