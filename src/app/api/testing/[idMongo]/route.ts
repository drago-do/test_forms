import { NextResponse } from "next/server";
import { Prueba } from "../../../../models/testing";
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
    // Conexión a MongoDB
    await mongodb();

    const { idMongo } = params;

    // Intentar buscar el documento por su ID
    const documento = await Prueba.findById(idMongo).exec();

    // Si no encuentra el documento, devolver error
    if (!documento) {
      return NextResponse.json({
        error: "Not Found",
        message: "Document not found",
      });
    }

    // Devolver el documento encontrado
    return NextResponse.json({ documento });
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
      // Conexión a MongoDB
      await mongodb();
  
      const { idMongo } = params;
      const body = await request.json();
  
      // Intentar encontrar y actualizar el documento por su ID
      const documentoActualizado = await Prueba.findByIdAndUpdate(
        idMongo,
        body,
        { new: true } // Devolver el documento actualizado
      ).exec();
  
      // Si no encuentra el documento, devolver error
      if (!documentoActualizado) {
        return NextResponse.json({
          error: "Not Found",
          message: "Document not found",
        });
      }
  
      // Devolver el documento actualizado
      return NextResponse.json({ documento: documentoActualizado });
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
      // Conexión a MongoDB
      await mongodb();
  
      const { idMongo } = params;
  
      // Intentar eliminar el documento por su ID
      const documentoEliminado = await Prueba.findByIdAndDelete(idMongo).exec();
  
      // Si no encuentra el documento, devolver error
      if (!documentoEliminado) {
        return NextResponse.json({
          error: "Not Found",
          message: "Document not found",
        });
      }
  
      // Devolver confirmación de eliminación
      return NextResponse.json({
        message: "Document deleted successfully",
        documento: documentoEliminado,
      });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }