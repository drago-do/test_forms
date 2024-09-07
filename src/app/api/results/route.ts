import { NextResponse } from "next/server";
import Resultados from "../../../models/results";
import mongodb from "../../../lib/mongodb";

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

// Obtener documentos de Resultados
export async function GET(request: Request) {
  try {
    await mongodb();
    const resultados = await Resultados.find();

    return NextResponse.json({
      success: true,
      data: resultados,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor",
      message: error.message,
    });
  }
}
