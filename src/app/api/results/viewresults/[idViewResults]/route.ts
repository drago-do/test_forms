import { NextResponse } from "next/server";
import mongodb from "../../../../../lib/mongodb";
import Resultados, { IResultados } from "../../../../../models/results";
import Prueba, { IPrueba } from "../../../../../models/testing";
import mongoose from "mongoose";

// Método GET: Recuperar los resultados de la prueba
export async function GET(
  request: any,
  { params }: { params: { idViewResults: string } }
) {
  try {
    const id_resultados = params.idViewResults;

    // Validar que el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id_resultados)) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    // Conectar a la base de datos
    await mongodb();

    // Obtener los resultados de la prueba
    const resultado = await (Resultados as mongoose.Model<IResultados>)
      .findById(id_resultados)
      .lean();

    if (!resultado) {
      return NextResponse.json(
        { error: "No se encontraron resultados para esta prueba." },
        { status: 404 }
      );
    }

    const { id_prueba, respuestas } = resultado;

    // Obtener los detalles de la prueba
    const prueba = await (Prueba as mongoose.Model<IPrueba>)
      .findById(id_prueba)
      .lean();
    if (!prueba) {
      return NextResponse.json(
        { error: "No se encontró la prueba." },
        { status: 404 }
      );
    }

    const tipoPrueba = prueba.tipo;
    //Secciona la logica de obtencion de resultados a partir de este punto

    const seccionesResultado =
      tipoPrueba === 1
        ? ResultadosDePruebaTipo1(prueba, respuestas)
        : ResultadosDePruebaTipo2(prueba, respuestas);

    return NextResponse.json({
      success: true,
      data: seccionesResultado,
    });
  } catch (error: any) {
    console.error("Error en GET:", error);
    return NextResponse.json({
      success: false,
      error: "Error al obtener los resultados.",
      message: error.message,
    });
  }
}

const ResultadosDePruebaTipo1 = (prueba, respuestas) => {
  const seccionesResultado: any[] = [];

  // Procesar las secciones de la prueba
  prueba.sections.forEach((seccion: any) => {
    let puntajeSeccion = 0;

    seccion.questions.forEach((pregunta: any) => {
      const respuesta = respuestas[pregunta._id.toString()];
      if (respuesta !== undefined) {
        const opcion = pregunta.opciones.find(
          (op: any) => op.valor === parseInt(respuesta)
        );
        if (opcion) {
          puntajeSeccion += opcion.valor;
        }
      }
    });

    console.log(puntajeSeccion);
    //Obtener el numero de preguntas
    const numPreguntas = seccion.questions.length;

    const PuntosTotalesDeSeccion = seccion?.valorMax * numPreguntas; //Esto equivale al 100 de la prueba
    //Obtener el porcentaje de acuerdo a los PuntosTotalesDeSeccion vs el puntuajeSeccion
    const porcentajeObtenido = (puntajeSeccion / PuntosTotalesDeSeccion) * 100;

    const numEscalas = prueba.escalas.nivel;
    //Obtener el porcentaje de crecimiento de acuerdo al numero de escalas  100 / numEscalas
    const brinco = PuntosTotalesDeSeccion / numEscalas;
    //Revisar en que escala entra el puntajeSeccion
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
  return seccionesResultado;
};
function ResultadosDePruebaTipo2(prueba: any, resultados: any) {
  let categoriasConteo: any = {};
  let categoriasUsuario: any = {};
  console.log(prueba);

  // Obtener el número total de opciones por categoría de cada pregunta con base en el objeto
  prueba.sections.forEach((seccion: any) => {
    seccion.questions.forEach((pregunta: any) => {
      pregunta.opciones.forEach((opcion: any) => {
        prueba.categorias.forEach((categoria: any) => {
          if (categoria.subcategorias.includes(opcion.subcategoria)) {
            if (!categoriasConteo[categoria.nombre]) {
              categoriasConteo[categoria.nombre] = {
                subcategorias: {},
                total: 0,
                enlaces: categoria.link || [],
              };
            }
            if (
              !categoriasConteo[categoria.nombre].subcategorias[
                opcion.subcategoria
              ]
            ) {
              categoriasConteo[categoria.nombre].subcategorias[
                opcion.subcategoria
              ] = 0;
            }
            categoriasConteo[categoria.nombre].subcategorias[
              opcion.subcategoria
            ]++;
            categoriasConteo[categoria.nombre].total++;
          }
        });
      });
    });
  });

  // Realiza un conteo de cuantas preguntas se respondieron de cada categoria
  for (const [preguntaId, subcategoria] of Object.entries(resultados)) {
    for (const categoria of prueba.categorias) {
      if (categoria.subcategorias.includes(subcategoria)) {
        if (!categoriasUsuario[categoria.nombre]) {
          categoriasUsuario[categoria.nombre] = {
            subcategorias: {},
            total: 0,
            enlaces: categoria.link || [],
          };
        }
        if (
          !categoriasUsuario[categoria.nombre].subcategorias[
            subcategoria as any
          ]
        ) {
          categoriasUsuario[categoria.nombre].subcategorias[
            subcategoria as any
          ] = 0;
        }
        categoriasUsuario[categoria.nombre].subcategorias[
          subcategoria as any
        ]++;
        categoriasUsuario[categoria.nombre].total++;
      }
    }
  }

  // Calcula el promedio de respuestas comparado con categoriasConteo
  const categoriasPromedio: any = {};
  for (const [nombreCategoria, conteo] of Object.entries<any>(
    categoriasUsuario
  )) {
    const totalRespuestas: any = (conteo as any).total;
    const totalOpciones: any =
      (categoriasConteo as any)[nombreCategoria]?.total || 1;
    const promedio: any = (totalRespuestas / totalOpciones) * 100;
    categoriasPromedio[nombreCategoria] = {
      promedio: (promedio as any).toFixed(2),
      ...(conteo as any),
    };
  }

  // Retorna las categorias y el promedio de cada categoria obtenido en un json
  return {
    total: categoriasConteo,
    usuario: categoriasPromedio,
  };
}
