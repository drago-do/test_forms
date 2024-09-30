import { NextResponse } from "next/server";
import Resultados, { IResultados } from "../../../models/results";
import mongodb from "../../../lib/mongodb";
import mongoose from "mongoose";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Método POST

// Crear un nuevo documento en Resultados
export async function POST(request: Request) {
  try {
    await mongodb();
    const data = await request.json();
    const newResultado = new Resultados(data);
    const savedResultado = await newResultado.save();

    return NextResponse.json({
      success: true,
      data: savedResultado,
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

// Método GET

// Obtener documentos de Resultados con paginación
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // Página actual, por defecto 1
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Límite de documentos por página, por defecto 10
  const skip = (page - 1) * limit; // Calcular cuántos documentos saltar

  try {
    await mongodb();
    const resultados: IResultados[] = await (
      Resultados as mongoose.Model<IResultados>
    )
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    const totalResultados = await Resultados.countDocuments(); // Contar el total de documentos

    return NextResponse.json({
      success: true,
      data: resultados,
      total: totalResultados,
      page,
      totalPages: Math.ceil(totalResultados / limit),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor",
      message: error.message,
    });
  }
}
