import { NextResponse } from "next/server";
import { Prueba } from "../../../models/testing";
import mongodb from "../../../lib/mongodb";

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
