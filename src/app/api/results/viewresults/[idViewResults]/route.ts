import { NextResponse } from "next/server";
import mongodb from "../../../../../lib/mongodb";
import Resultados, { IResultados } from "../../../../../models/results";
import Prueba, { IPrueba } from "../../../../../models/testing";
import mongoose from "mongoose";

// Método GET: Recuperar los resultados de la prueba
export async function GET(
  request: any,
  { params }: { params: { idviewResults: string } }
) {
  try {
    const id_resultados = params.idviewResults;

    // Validar que el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id_resultados)) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    // Conectar a la base de datos
    await mongodb();

    // Obtener los resultados de la prueba
    const resultado = await (Resultados as mongoose.Model<IResultados>).findById(id_resultados).lean();
    if (!resultado) {
      return NextResponse.json(
        { error: "No se encontraron resultados para esta prueba." },
        { status: 404 }
      );
    }

    const { id_prueba, respuestas } = resultado;

    // Obtener los detalles de la prueba
    const prueba = await (Prueba as mongoose.Model<IPrueba>).findById(id_prueba).lean();
    if (!prueba) {
      return NextResponse.json(
        { error: "No se encontró la prueba." },
        { status: 404 }
      );
    }

    const seccionesResultado: any[] = [];

    // Procesar las secciones de la prueba
    prueba.sections.forEach((seccion: any) => {
      let puntajeSeccion = 0;

      seccion.questions.forEach((pregunta: any) => {
        const respuesta = respuestas[pregunta._id.toString()];
        if (respuesta !== undefined) {
          const opcion = pregunta.opciones.find((op: any) => op.valor === respuesta);
          if (opcion) {
            puntajeSeccion += opcion.valor;
          }
        }
      });

      const porcentajeObtenido = (puntajeSeccion / seccion.valorMax) * 100;
      const numEscalas = prueba.escalas.nivel;
      const brinco = seccion.valorMax / numEscalas;
      let escala = Math.ceil(puntajeSeccion / brinco);

      if (escala > numEscalas) {
        escala = numEscalas;
      }
      const escalaTexto =
        prueba.escalas.escala[escala - 1] || "Error al obtener escala";

      seccionesResultado.push({
        nombreSeccion: seccion.name,
        porcentaje: porcentajeObtenido.toFixed(2),
        escala: escalaTexto,
        enlaces: seccion.link,
      });
    });

    return NextResponse.json({ secciones: seccionesResultado }, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener los resultados." },
      { status: 500 }
    );
  }
}
