import { NextResponse } from "next/server";
import User, { IUser } from "../../../../../models/user";
import Prueba, { IPrueba } from "./../../../../../models/testing";
import Resultados, { IResultados } from "./../../../../../models/results";
import mongodb from "../../../../../lib/mongodb";
import mongoose from "mongoose";
import { generarHTML, generarPDF } from "./generarPDF";
import { type NextRequest } from "next/server";

// Nueva función para obtener todos los usuarios con paginado
export async function GET(
  request: NextRequest,
  { params }: { params: { idUsuario: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const view: boolean = searchParams.get("view") === "true";

  try {
    await mongodb();
    const user: IUser = await (User as mongoose.Model<IUser>)
      .findById(params.idUsuario)
      .select("-password")
      .exec();

    //Comprobar si el usuario existe
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        message: "User not found",
      });
    }

    // Obtener los test que ha respondido
    const resultados: IResultados[] = await (
      Resultados as mongoose.Model<IResultados>
    )
      .find({
        id_user: params.idUsuario,
      })
      .populate({
        path: "id_prueba",
        model: Prueba,
      })
      .exec();

    // Ordenar los resultados por tipo de prueba de menor a mayor
    resultados.sort((a, b) => {
      const tipoA = (a.id_prueba as any)?.tipo || 0;
      const tipoB = (b.id_prueba as any)?.tipo || 0;
      return tipoA - tipoB;
    });

    const HTML: string = await generarHTML(user, resultados);

    if (view) {
      //Responde con la pagina html sola
      return new Response(HTML, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    //Crear PDF con la pagina html
    const pdf = await generarPDF(HTML);

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
