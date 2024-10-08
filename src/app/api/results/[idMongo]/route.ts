import { NextResponse } from "next/server";
import Resultados, { IResultados } from "../../../../models/results";
import Prueba, { IPrueba } from "../../../../models/testing";
import User, { IUser } from "../../../../models/user";
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
    await mongodb();
    const resultado: IResultados = await (
      Resultados as mongoose.Model<IResultados>
    )
      .findById(params.idMongo)
      .populate({
        path: "id_prueba",
        model: Prueba as mongoose.Model<IPrueba>,
      })
      .populate({
        path: "id_user",
        model: User as mongoose.Model<IUser>,
      })
      .exec();

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

    const resultadoActualizado: IResultados = await (
      Resultados as mongoose.Model<IResultados>
    )
      .findByIdAndUpdate(
        params.idMongo,
        body,
        { new: true } // Devolver el documento actualizado
      )
      .exec();

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

    const resultadoEliminado: IResultados = await (
      Resultados as mongoose.Model<IResultados>
    )
      .findByIdAndDelete(params.idMongo)
      .exec();

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
