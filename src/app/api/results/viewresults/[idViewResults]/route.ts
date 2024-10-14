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
    console.log(resultado);

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

  // Inicializar las categorías y subcategorías en el objeto de resultado
  prueba.categorias.forEach((categoria: any) => {
    categoriasConteo[categoria.nombre] = {
      subcategorias: {},
      total: 0,
      enlaces: [], // Inicializar enlaces como un array vacío
    };

    categoria.subcategorias.forEach((subcategoria: any) => {
      categoriasConteo[categoria.nombre].subcategorias[subcategoria] = 0;
    });
  });

  // Contar las apariciones de cada subcategoría en las respuestas
  Object.entries(resultados).forEach(([preguntaId, subcategoria]: any) => {
    prueba.categorias.forEach((categoria: any) => {
      if (categoria.subcategorias.includes(subcategoria)) {
        categoriasConteo[categoria.nombre].subcategorias[subcategoria]++;
        categoriasConteo[categoria.nombre].total++;

        // Añadir enlaces de la sección correspondiente a la categoría
        const seccion = prueba.sections.find((sec: any) =>
          sec.questions.some(
            (pregunta: any) => pregunta._id.toString() === preguntaId
          )
        );
        if (seccion && seccion.link) {
          categoriasConteo[categoria.nombre].enlaces.push(...seccion.link);
        }
      }
    });
  });

  // Ordenar las categorías por total de mayor a menor
  const categoriasOrdenadas: any = Object.entries(categoriasConteo)
    .sort(([, a]: any, [, b]: any) => b.total - a.total)
    .reduce((acc: any, [key, value]: any) => {
      acc[key] = value;
      return acc;
    }, {});

  return categoriasOrdenadas;
}
