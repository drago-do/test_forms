import { NextResponse } from "next/server";
import mongodb from "../../../../../lib/mongodb";
import Resultados from "../../../../../models/results";
import Prueba from "../../../../../models/testing";
import mongoose from "mongoose";

// Método GET: Recuperar los resultados de la prueba
export async function GET(
  request: any,
  { params }: { params: { idviewResulst: string } }
) {
  try {
    const id_resultados = params.idviewResulst; // Obtener id de la prueba desde los parámetros

    // Validar que el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id_resultados)) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    // Obtener los resultados de la prueba y procesarlos
    const response = await obtenerResultadosPrueba(id_resultados);

    if (response.error) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener los resultados." },
      { status: 500 }
    );
  }
}

// Función principal para obtener los resultados de una prueba
export async function obtenerResultadosPrueba(id_resultados: any): Promise<any> {
  try {
    // Conectarse a la base de datos
    await mongodb();

    const resultado = await Resultados.findById(id_resultados).lean();

    if (!resultado) {
      return { error: "No se encontraron resultados para esta prueba." };
    }

    const { id_prueba, respuestas } = resultado;

    const prueba = await Prueba.findById(id_prueba).lean();

    if (!prueba) {
      return { error: "No se encontró la prueba." };
    }

    const seccionesResultado: any[] = [];

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

    return { secciones: seccionesResultado };
  } catch (error: any) {
    console.error("Error obteniendo los resultados de la prueba:", error);
    return { error: "Error interno del servidor." };
  }
}
