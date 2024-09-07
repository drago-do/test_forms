import { NextResponse } from "next/server";
import Resultados from "../../../../models/results";
import mongodb from "../../../../lib/mongodb";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

// Metodo GET

// Obtener un documento por su ID
export async function GET(
  request: Request,
  { params }: { params: { idMongo: string } }
) {
  try {
    await mongodb();
    const resultado = await Resultados.findById(params.idMongo).exec();

    if (!resultado) {
      return NextResponse.json({
        error: "Not Found",
        message: "Document not found",
      });
    }

    return NextResponse.json({ resultado });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

// Metodo PUT

// Actualizar un documento por su ID
export async function PUT(
    request: Request,
    { params }: { params: { idMongo: string } }
  ) {
    try {
      await mongodb();
      const body = await request.json();
  
      const resultadoActualizado = await Resultados.findByIdAndUpdate(
        params.idMongo,
        body,
        { new: true } // Devolver el documento actualizado
      ).exec();
  
      if (!resultadoActualizado) {
        return NextResponse.json({
          error: "Not Found",
          message: "Document not found",
        });
      }
  
      return NextResponse.json({ resultado: resultadoActualizado });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

// Metodo DELETE

// Eliminar un documento por su ID
export async function DELETE(
    request: Request,
    { params }: { params: { idMongo: string } }
  ) {
    try {
      await mongodb();
  
      const resultadoEliminado = await Resultados.findByIdAndDelete(params.idMongo).exec();
  
      if (!resultadoEliminado) {
        return NextResponse.json({
          error: "Not Found",
          message: "Document not found",
        });
      }
  
      return NextResponse.json({
        message: "Document deleted successfully",
        resultado: resultadoEliminado,
      });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }