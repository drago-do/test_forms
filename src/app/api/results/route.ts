import { NextResponse } from "next/server";
import Resultados from "../../../models/results";
import mongodb from "../../../lib/mongodb";

// Constantes para paginación
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// Función auxiliar para manejar errores
const handleError = (error: any) => {
  console.error("Error:", error);
  return NextResponse.json({
    success: false,
    error: "Internal Server Error",
    message: error.message,
  }, { status: 500 });
};

// Método POST para crear un nuevo resultado
export async function POST(request: Request) {
  try {
    const resultadoData = await request.json();
    console.log("Nuevo resultado:", resultadoData);

    await mongodb();
    const newResultado = new Resultados(resultadoData);
    const savedResultado = await newResultado.save();

    return NextResponse.json({
      success: true,
      data: savedResultado,
    }, { status: 201 });
  } catch (error: any) {
    return handleError(error);
  }
}

// Método GET para obtener todos los resultados con paginado
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10);
    const limit = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10);
    const skip = (page - 1) * limit;

    await mongodb();
    const [resultados, totalResultados] = await Promise.all([
      Resultados.find()
        .skip(skip)
        .limit(limit)
        .populate("id_prueba id_user", "-password")
        .exec(),
      Resultados.countDocuments()
    ]);

    return NextResponse.json({
      success: true,
      data: resultados,
      total: totalResultados,
      page,
      totalPages: Math.ceil(totalResultados / limit),
    });
  } catch (error: any) {
    return handleError(error);
  }
}