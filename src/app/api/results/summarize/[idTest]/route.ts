import { NextResponse } from "next/server";
import User, { IUser } from "../../../../../models/user";
import Prueba, { IPrueba } from "../../../../../models/testing";
import Resultados, { IResultados } from "../../../../../models/results";
import mongodb from "../../../../../lib/mongodb";
import mongoose from "mongoose";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 1. Obtener Resultados de una Prueba (GET) - Leer
export async function GET(
  request: Request,
  { params }: { params: { idTest: string } }
) {
  try {
    await mongodb();
    console.log("hey");

    // Validar que el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(params.idTest)) {
      return NextResponse.json(
        { success: false, error: "ID no válido" },
        { status: 400 }
      );
    }

    // Obtener los resultados de la prueba
    const resultados = await (Resultados as mongoose.Model<IResultados>)
      .find({ id_prueba: params.idTest })
      .populate({
        path: "id_user",
        select:
          "firstName lastName email role creationDate phone currentSchool educationLevel generation grade group",
        model: User,
      }) // Popula el campo de id_user
      .lean();

    if (!resultados || resultados.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Not Found",
          message: "No results found for this test",
        },
        { status: 404 }
      );
    }

    // Obtener los detalles de la prueba
    const prueba = await (Prueba as mongoose.Model<IPrueba>)
      .findById(params.idTest)
      .lean();
    if (!prueba) {
      return NextResponse.json(
        { success: false, error: "No se encontró la prueba." },
        { status: 404 }
      );
    }

    // Procesar las secciones de la prueba y calcular el porcentaje para cada resultado
    resultados.forEach((resultado: any) => {
      const seccionesResultado: any[] = [];

      prueba.sections.forEach((seccion: any) => {
        let puntajeSeccion = 0;

        seccion.questions.forEach((pregunta: any) => {
          const respuesta = resultado.respuestas[pregunta._id.toString()];
          if (respuesta !== undefined) {
            const opcion = pregunta.opciones.find(
              (op: any) => op.valor === parseInt(respuesta)
            );
            if (opcion) {
              puntajeSeccion += opcion.valor;
            }
          }
        });

        const numPreguntas = seccion.questions.length;
        const PuntosTotalesDeSeccion = seccion?.valorMax * numPreguntas;
        const porcentajeObtenido =
          (puntajeSeccion / PuntosTotalesDeSeccion) * 100;

        const numEscalas = prueba.escalas.nivel;
        const brinco = PuntosTotalesDeSeccion / numEscalas;
        const escala = Math.ceil(puntajeSeccion / brinco);

        const escalaTexto =
          prueba.escalas.escala[escala - 1] || "Error al obtener escala";

        seccionesResultado.push({
          nombreSeccion: seccion.name,
          porcentaje: porcentajeObtenido.toFixed(2),
          escala: escalaTexto,
          enlaces: seccion.link,
        });
      });

      resultado.seccionesResultado = seccionesResultado;
    });

    return NextResponse.json({
      success: true,
      data: resultados,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
