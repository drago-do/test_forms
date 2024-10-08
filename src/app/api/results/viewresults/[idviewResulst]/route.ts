import { NextResponse } from "next/server";
import mongodb from "../../../../../lib/mongodb";
import Resultados, { IResultados } from "../../../../../models/results";
import { Prueba, IPrueba } from "../../../../../models/testing";
import mongoose from "mongoose";

// Método GET: Recuperar los resultados de la prueba
export async function GET(
  request: Request,
  { params }: { params: { idviewResulst: string } }
) {
  try {
    const id_resultados = params.idviewResulst; // Obtener id de la prueba desde los parámetros

    // Obtener los resultados de la prueba y procesarlos
    const response = await obtenerResultadosPrueba(id_resultados);

    if (response.error) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener los resultados." },
      { status: 500 }
    );
  }
}

// Función principal para obtener los resultados de una prueba
export async function obtenerResultadosPrueba(id_resultados: string) {
  try {
    // Conectarse a la base de datos
    await mongodb();

    const resultado = await (
      Resultados as mongoose.Model<IResultados>
    )
      .findById(id_resultados)
      .lean() as unknown as IResultados

    // Obtener los resultados de la prueba para ese id_resultados

    if (!resultado) {
      return { error: "No se encontraron resultados para esta prueba." };
    }

    const { id_prueba, respuestas } = resultado;

    // Obtener la prueba correspondiente
    const prueba: IPrueba = await (Prueba as mongoose.Model<IPrueba>)
      .findById(id_prueba)
      .lean() as unknown as IPrueba

    if (!prueba) {
      return { error: "No se encontró la prueba." };
    }

    // Clasificar las preguntas por secciones y calcular el porcentaje y escala
    const seccionesResultado: any[] = [];

    prueba.sections.forEach((seccion: any) => {
      let puntajeSeccion = 0;

      // Obtener el puntaje de la sección comparando las respuestas
      seccion?.questions?.forEach((pregunta: any) => {
        const respuesta = respuestas[pregunta._id.toString()]; // Acceso como objeto
        if (respuesta !== undefined) {
          const opcion = pregunta.opciones.find(
            (op: any) => op.valor === respuesta
          );
          if (opcion) {
            puntajeSeccion += opcion.valor;
          }
        }
      });

      // Calcular el porcentaje obtenido para la sección
      const porcentajeObtenido = (puntajeSeccion / seccion?.valorMax) * 100;

      // Calcular la escala
      const numEscalas = prueba.escalas.nivel;
      const brinco = seccion.valorMax / numEscalas;
      let escala = Math.ceil(puntajeSeccion / brinco);

      if (escala > numEscalas) {
        escala = numEscalas; // En caso de que exceda el número de escalas
      }
      const escalaTexto =
        prueba?.escalas?.escala[escala - 1] || "Error al obtener escala";

      // Añadir la información de la sección al resultado
      seccionesResultado.push({
        nombreSeccion: seccion.name,
        porcentaje: porcentajeObtenido.toFixed(2),
        escala: escalaTexto,
        enlaces: seccion.link, // Asumiendo que link es un array de strings
      });
    });

    // Retornar el JSON final con los resultados procesados
    return { secciones: seccionesResultado };
  } catch (error) {
    console.error("Error obteniendo los resultados de la prueba:", error);
    return { error: "Error interno del servidor." };
  }
}
