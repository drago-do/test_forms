import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import mongodb from "../../../../lib/mongodb";
import Resultados, { IResultados } from "../../../../models/results";
import Prueba, { ISeccion, IPrueba } from "../../../../models/testing";
import User from "../../../../models/user";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation

//=========================================================================================================================================================
// Organizes data without calculating percentages
const organizeDataWithoutPercentages = (preguntas, categorias, resultados) => {
  const encabezadosCategorias = [];
  const encabezadosSubcategorias = [];
  const merges = [];
  let currentColumn = 1;

  categorias.forEach((categoria) => {
    encabezadosCategorias.push(
      categoria.nombre,
      ...Array(categoria.subcategorias.length - 1).fill(null)
    );
    merges.push({
      s: { c: currentColumn, r: 0 },
      e: { c: currentColumn + categoria.subcategorias.length - 1, r: 0 },
    });
    encabezadosSubcategorias.push(...categoria.subcategorias);
    currentColumn += categoria.subcategorias.length;
  });

  const encabezadosFinales = [
    ["Items", ...encabezadosCategorias],
    [null, ...encabezadosSubcategorias],
  ];
  const dataRows = preguntas.map((pregunta) => {
    const fila = [pregunta.texto];
    categorias.forEach((categoria) => {
      categoria.subcategorias.forEach((subcategoria) => {
        const frecuencias = resultados.reduce((acc, resultado) => {
          const respuestaTexto = resultado.respuestas[pregunta._id.toString()];
          if (
            respuestaTexto &&
            pregunta.opciones.some(
              (opcion) => opcion.subcategoria === subcategoria
            )
          ) {
            const respuestaCodigo =
              respuestaTexto.match(/\(([^)]+)\)/)?.[1] || "";
            if (respuestaCodigo) {
              acc[respuestaCodigo] = (acc[respuestaCodigo] || 0) + 1;
            }
          }
          return acc;
        }, {});
        fila.push(
          Object.values(frecuencias).reduce(
            (acc: number, curr) => acc + (curr as number),
            0
          )
        );
      });
    });
    return fila;
  });

  dataRows.push([
    "Total",
    ...dataRows.reduce((acc, row) => {
      row.slice(1).forEach((value, index) => {
        acc[index] = (acc[index] || 0) + value;
      });
      return acc;
    }, []),
  ]);

  return { encabezadosFinales, dataRows, merges };
};

//=========================================================================================================================================================
// Function to handle GET request for exporting results
export async function GET(request, { params }) {
  console.log("Iniciando la exportación de resultados...");
  console.log("ID de prueba recibido:", params.idexport);

  const id_prueba = params.idexport; // Se cambia el nombre del parámetro a minúsculas
  console.log(`ID de prueba recibido: ${id_prueba}`);

  // Verificar si el id es un ObjectId válido
  if (!id_prueba || !mongoose.Types.ObjectId.isValid(id_prueba)) {
    return NextResponse.json(
      { error: "El parámetro 'id' es requerido y debe ser un ObjectId válido" },
      { status: 400 }
    );
  }

  try {
    await mongodb(); // Connect to MongoDB
    console.log("Conexión a MongoDB exitosa");

    //=========================================================================================================================================================

    // Fetch results associated with the test ID, populating user data
    const resultados = await (Resultados as mongoose.Model<IResultados>)
      .find({ id_prueba: id_prueba })
      .populate({
        path: "id_user",
        model: User,
        select:
          "firstName lastName email role creationDate phone currentSchool educationLevel generation grade group",
      });

    console.log(`Resultados encontrados: ${resultados.length}`);

    // Find the test document
    const documento = await (Prueba as mongoose.Model<IPrueba>).findById(
      id_prueba
    );
    if (!documento) {
      console.error(
        `No se encontró un documento para el ID de prueba: ${id_prueba}`
      );
      return NextResponse.json(
        {
          error: `No se encontró documento para el ID de prueba: ${id_prueba}`,
        },
        { status: 404 }
      );
    }

    //=========================================================================================================================================================
    //=========================================================================================================================================================
    //=========================================================================================================================================================

    // Logic for test type 1
    if (documento.tipo === 1) {
      const preguntas =
        (documento?.sections as unknown as ISeccion[])?.flatMap(
          (section) => section.questions
        ) || [];

      // Format data for Excel export
      const data = await Promise.all(
        resultados.map(async (resultado) => {
          const user: any = resultado.id_user;
          const userInfo = {
            Nombre: user.firstName || "",
            Apellido: user.lastName || "",
            Email: user.email || "",
            Rol: user.role || "",
            Fecha_de_Aplicativo: user.creationDate
              ? new Date(user.creationDate).toLocaleDateString()
              : "",
            Celular: user.phone || "",
            Escuela_Actual: user.currentSchool || "",
            Nivel_Educativo: user.educationLevel || "",
            Generacion: user.generation || "",
            Grado: user.grade || "",
            Grupo: user.group || "",
          };

          const respuestasFormateadas =
            resultado.respuestas && typeof resultado.respuestas === "object"
              ? Object.fromEntries(
                  Object.entries(resultado.respuestas).map(
                    ([idPregunta, respuesta]) => {
                      const pregunta: any =
                        preguntas.find(
                          (p: any) => p?._id.toString() === idPregunta
                        ) || {};
                      const textoPregunta: any =
                        pregunta?.texto || `Pregunta ${idPregunta}`;
                      console.log(
                        `Procesando respuesta para la pregunta: ${textoPregunta}, respuesta: ${respuesta}`
                      );
                      return [textoPregunta, respuesta];
                    }
                  )
                )
              : {};

          // Crear propiedades aplanadas para cada sección con el nombre y el porcentaje, incluyendo el símbolo de porcentaje
          const seccionesResultado = documento.sections.reduce(
            (acc, seccion: any) => {
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
              const PuntosTotalesDeSeccion = seccion?.valorMax * numPreguntas; // Representa el 100%
              const porcentajeObtenido =
                ((puntajeSeccion / PuntosTotalesDeSeccion) * 100).toFixed(0) +
                "%";

              // Agregar el nombre de la sección y el porcentaje al objeto final, incluyendo el símbolo de porcentaje
              acc[seccion.name] = porcentajeObtenido;
              return acc;
            },
            {}
          );

          return {
            ...userInfo,
            ...respuestasFormateadas,
            ...seccionesResultado, // Add section results and scale names
          };
        })
      );

      console.log(
        "Datos formateados para Excel:",
        JSON.stringify(data, null, 2)
      );

      // Create Excel workbook and sheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });
      console.log("Archivo Excel creado.");

      // Set document title
      const titulo = documento?.titulo || "Resultado";
      console.log("Título del documento:", titulo);

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename=Resultado_Tests_${titulo}.xlsx`,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    }

    //=========================================================================================================================================================
    //=========================================================================================================================================================
    //=========================================================================================================================================================
    //=========================================================================================================================================================
    //=========================================================================================================================================================

    // Logic for test type 2
    if (documento.tipo === 2) {
      const preguntas =
        (documento?.sections || []).flatMap(
          (section: any) => section.questions
        ) || [];
      const categorias = documento.categorias || [];

      if (!resultados.length) {
        console.error(
          `No se encontraron resultados para el ID de prueba: ${id_prueba}`
        );
        return NextResponse.json(
          {
            error: `No se encontraron resultados para el ID de prueba: ${id_prueba}`,
          },
          { status: 404 }
        );
      }

      const { encabezadosFinales, dataRows, merges } =
        organizeDataWithoutPercentages(preguntas, categorias, resultados);
      console.log(`Encabezados finales: ${JSON.stringify(encabezadosFinales)}`);
      console.log(`Filas de datos: ${JSON.stringify(dataRows, null, 2)}`);

      const workbook = XLSX.utils.book_new();
      const hojaResultados = XLSX.utils.aoa_to_sheet([
        ...encabezadosFinales,
        ...dataRows,
      ]);
      hojaResultados["!merges"] = merges;
      XLSX.utils.book_append_sheet(workbook, hojaResultados, "Datos Generales");

      //=========================================================================================================================================================
      //=========================================================================================================================================================

      // Lógica para la hoja de datos individuales
      // Lógica para la hoja de datos individuales
      // Lógica para la hoja de datos individuales
      const hojaDatosIndividuales = XLSX.utils.json_to_sheet(
        await Promise.all(
          resultados.map(async (resultado) => {
            const { id_user: user, respuestas } = resultado;

            // Información básica del usuario
            const userInfo = {
              Nombre: (user as any).firstName || "",
              Apellido: (user as any).lastName || "",
              Email: (user as any).email || "",
              Rol: (user as any).role || "",
              Fecha_de_Aplicativo: (user as any).creationDate
                ? new Date((user as any).creationDate).toLocaleDateString()
                : "",
              Celular: (user as any).phone || "",
              Escuela_Actual: (user as any).currentSchool || "",
              Nivel_Educativo: (user as any).educationLevel || "",
              Generacion: (user as any).generation || "",
              Grado: (user as any).grade || "",
              Grupo: (user as any).group || "",
            };

            // Respuestas formateadas para cada pregunta
            const respuestasFormateadas =
              respuestas && typeof respuestas === "object"
                ? Object.fromEntries(
                    Object.entries(respuestas).map(
                      ([idPregunta, respuesta]) => {
                        const pregunta = preguntas.find(
                          (p) => p?._id.toString() === idPregunta
                        );
                        return [pregunta?.texto || idPregunta, respuesta];
                      }
                    )
                  )
                : {};

            // Contador de opciones totales por categoría y subcategoría
            const categoriasConteo: any = {};
            preguntas.forEach((pregunta: any) => {
              pregunta.opciones.forEach((opcion: any) => {
                categorias.forEach((categoria: any) => {
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

            // Contador de respuestas del usuario por categoría y subcategoría
            const categoriasUsuario: any = {};
            preguntas.forEach((pregunta: any) => {
              const respuestaTexto = respuestas[pregunta._id.toString()];
              if (respuestaTexto) {
                categorias.forEach((categoria: any) => {
                  categoria.subcategorias.forEach((subcategoria: any) => {
                    if (
                      pregunta.opciones.some(
                        (opcion) => opcion.subcategoria === subcategoria
                      )
                    ) {
                      if (!categoriasUsuario[categoria.nombre]) {
                        categoriasUsuario[categoria.nombre] = {
                          subcategorias: {},
                          total: 0,
                          enlaces: categoria.link || [],
                        };
                      }
                      if (
                        !categoriasUsuario[categoria.nombre].subcategorias[
                          subcategoria
                        ]
                      ) {
                        categoriasUsuario[categoria.nombre].subcategorias[
                          subcategoria
                        ] = 0;
                      }
                      categoriasUsuario[categoria.nombre].subcategorias[
                        subcategoria
                      ]++;
                      categoriasUsuario[categoria.nombre].total++;
                    }
                  });
                });
              }
            });

            // Cálculo de conteos y promedios
            const categoriasConConteo: any = {};
            const categoriasConPorcentaje: any = {};
            for (const [nombreCategoria, conteo] of Object.entries<any>(
              categoriasUsuario
            )) {
              const totalRespuestas = conteo.total;
              const totalOpciones =
                categoriasConteo[nombreCategoria]?.total || 1; // Total de opciones posibles para la categoría
              const promedio = (totalRespuestas / totalOpciones) * 100; // Porcentaje basado en el total de opciones

              // Asignar conteos
              Object.entries(conteo.subcategorias).forEach(
                ([subcat, count]) => {
                  categoriasConConteo[
                    `${nombreCategoria} - ${subcat} - Conteo`
                  ] = count;
                }
              );

              // Asignar porcentajes
              categoriasConPorcentaje[
                `${nombreCategoria} - Porcentaje`
              ] = `${promedio.toFixed(2)}%`;
            }

            // Devolvemos los resultados organizados
            return {
              ...userInfo,
              ...respuestasFormateadas,
              ...categoriasConConteo, // Primero los conteos
              ...categoriasConPorcentaje, // Luego los porcentajes
            };
          })
        )
      );

      console.log("hojaDatosIndividuales", hojaDatosIndividuales);
      XLSX.utils.book_append_sheet(
        workbook,
        hojaDatosIndividuales,
        "Resultados Detallados"
      );
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });

      console.log("Archivo Excel creado para tipo 2.");
      const titulo = documento?.titulo || "Resultado";

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename=Resultados_${titulo}.xlsx`,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    }
  } catch (error) {
    console.error("Error durante la exportación de resultados:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al generar los resultados" },
      { status: 500 }
    );
  }
}
