import { NextResponse } from "next/server";
import Prueba, { IPrueba } from "../../../../models/testing";
import mongodb from "../../../../lib/mongodb";
import mongoose from "mongoose";

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
    const documento: IPrueba = await (Prueba as mongoose.Model<IPrueba>)
      .findById(idMongo)
      .exec();

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
    console.log("body");
    console.log(body);

    // Intentar encontrar y actualizar el documento por su ID
    const documentoActualizado: IPrueba = await (
      Prueba as mongoose.Model<IPrueba>
    )
      .findByIdAndUpdate(
        idMongo,
        body,
        { new: true } // Devolver el documento actualizado
      )
      .exec();

    // Si no encuentra el documento, devolver error
    if (!documentoActualizado) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Document not found",
      });
    }

    // Devolver el documento actualizado
    return NextResponse.json({
      success: true,
      data: documentoActualizado,
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Metodo DELETE

// Eliminar un documento por su ID de forma lógica
export async function DELETE(
  request: Request,
  { params }: { params: { idMongo: string } }
) {
  try {
    // Conexión a MongoDB
    await mongodb();

    const { idMongo } = params;

    // Intentar encontrar y actualizar el campo 'eliminado' del documento por su ID
    const documentoActualizado: IPrueba = await (
      Prueba as mongoose.Model<IPrueba>
    )
      .findByIdAndUpdate(
        idMongo,
        { eliminado: true }, // Marcar el documento como eliminado
        { new: true } // Devolver el documento actualizado
      )
      .exec();

    // Si no encuentra el documento, devolver error
    if (!documentoActualizado) {
      return NextResponse.json({
        success: false,
        error: "Not Found",
        message: "Document not found",
      });
    }

    // Devolver confirmación de eliminación lógica
    return NextResponse.json({
      success: true,
      message: "Document logically deleted successfully",
      documento: documentoActualizado,
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
