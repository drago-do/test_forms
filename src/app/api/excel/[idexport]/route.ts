import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import mongodb from "../../../../lib/mongodb";
import Resultados from "../../../../models/results";
import Prueba, { ISeccion } from "../../../../models/testing";
import User from "./../../../../models/user";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation

// Organizes data without calculating percentages
const organizeDataWithoutPercentages = (preguntas, categorias, resultados) => {
  const encabezadosCategorias = [];
  const encabezadosSubcategorias = [];
  const merges = [];
  let currentColumn = 1;

  categorias.forEach(categoria => {
    encabezadosCategorias.push(categoria.nombre, ...Array(categoria.subcategorias.length - 1).fill(null));
    merges.push({ s: { c: currentColumn, r: 0 }, e: { c: currentColumn + categoria.subcategorias.length - 1, r: 0 } });
    encabezadosSubcategorias.push(...categoria.subcategorias);
    currentColumn += categoria.subcategorias.length;
  });

  const encabezadosFinales = [['Items', ...encabezadosCategorias], [null, ...encabezadosSubcategorias]];
  const dataRows = preguntas.map(pregunta => {
    const fila = [pregunta.texto];
    categorias.forEach(categoria => {
      categoria.subcategorias.forEach(subcategoria => {
        const frecuencias = resultados.reduce((acc, resultado) => {
          const respuestaTexto = resultado.respuestas[pregunta._id.toString()];
          if (respuestaTexto && pregunta.opciones.some(opcion => opcion.subcategoria === subcategoria)) {
            const respuestaCodigo = respuestaTexto.match(/\(([^)]+)\)/)?.[1] || '';
            if (respuestaCodigo) {
              acc[respuestaCodigo] = (acc[respuestaCodigo] || 0) + 1;
            }
          }
          return acc;
        }, {});
        fila.push(Object.values(frecuencias).reduce((acc: number, curr: unknown) => acc + (curr as number), 0));
      });
    });
    return fila;
  });

  dataRows.push(['Total', ...dataRows.reduce((acc, row) => {
    row.slice(1).forEach((value, index) => {
      acc[index] = (acc[index] || 0) + value;
    });
    return acc;
  }, [])]);

  return { encabezadosFinales, dataRows, merges };
};

// Function to handle GET request for exporting results
export async function GET(request, { params }) {
  console.log("Iniciando la exportación de resultados...");

  const idPrueba = params.idExport || "";
  console.log(`ID de prueba recibido: ${idPrueba}`);

  // Validate 'idPrueba' parameter
  if (!idPrueba || !mongoose.Types.ObjectId.isValid(idPrueba)) {
    return NextResponse.json(
      { error: "El parámetro 'id' es requerido y debe ser un ObjectId válido" },
      { status: 400 }
    );
  }

  try {
    await mongodb(); // Connect to MongoDB
    console.log("Conexión a MongoDB exitosa");

    // Fetch results associated with the test ID, populating user data
    const resultados = await Resultados.find({ id_prueba: idPrueba })
      .populate({ path: 'id_user', model: User, select: "firstName lastName email role creationDate phone currentSchool educationLevel generation grade group" });

    console.log(`Resultados encontrados: ${resultados.length}`);

    // Find the test document
    const documento = await Prueba.findById(idPrueba);
    if (!documento) {
      console.error(`No se encontró un documento para el ID de prueba: ${idPrueba}`);
      return NextResponse.json({ error: `No se encontró documento para el ID de prueba: ${idPrueba}` }, { status: 404 });
    }

    // Logic for test type 1
    if (documento.tipo === 1) {
      // Prepare questions from the test document
      const preguntas = (documento?.sections as unknown as ISeccion[])?.flatMap(
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
            Fecha_de_Aplicativo: user.creationDate ? new Date(user.creationDate).toLocaleDateString() : "",
            Celular: user.phone || "",
            Escuela_Actual: user.currentSchool || "",
            Nivel_Educativo: user.educationLevel || "",
            Generacion: user.generation || "",
            Grado: user.grade || "",
            Grupo: user.group || "",
          };

          const respuestasFormateadas = resultado.respuestas && typeof resultado.respuestas === "object"
            ? Object.fromEntries(
                Object.entries(resultado.respuestas).map(
                  ([idPregunta, respuesta]) => {
                    const pregunta: any = preguntas.find(
                      (p: any) => p?._id.toString() === idPregunta
                    ) || {};
                    const textoPregunta: any = pregunta?.texto || `Pregunta ${idPregunta}`;
                    console.log(`Procesando respuesta para la pregunta: ${textoPregunta}, respuesta: ${respuesta}`);
                    return [textoPregunta, respuesta];
                  }
                )
              )
            : {};

          return {
            ...userInfo,
            ...respuestasFormateadas,
          };
        })
      );

      console.log("Datos formateados para Excel:", JSON.stringify(data, null, 2));

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
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    }

    // Logic for test type 2
    if (documento.tipo === 2) {
      const preguntas = (documento?.sections || []).flatMap(section => section.questions) || [];
      const categorias = documento.categorias || [];

      if (!resultados.length) {
        console.error(`No se encontraron resultados para el ID de prueba: ${idPrueba}`);
        return NextResponse.json({ error: `No se encontraron resultados para el ID de prueba: ${idPrueba}` }, { status: 404 });
      }

      const { encabezadosFinales, dataRows, merges } = organizeDataWithoutPercentages(preguntas, categorias, resultados);
      console.log(`Encabezados finales: ${JSON.stringify(encabezadosFinales)}`);
      console.log(`Filas de datos: ${JSON.stringify(dataRows, null, 2)}`);

      const workbook = XLSX.utils.book_new();
      const hojaResultados = XLSX.utils.aoa_to_sheet([...encabezadosFinales, ...dataRows]);
      hojaResultados['!merges'] = merges;
      XLSX.utils.book_append_sheet(workbook, hojaResultados, "Datos Generales");

      const hojaDatosIndividuales = XLSX.utils.json_to_sheet(await Promise.all(resultados.map(async (resultado) => {
        const { id_user: user, respuestas = {} } = resultado;
        const userInfo = {
          Nombre: user.firstName || "",
          Apellido: user.lastName || "",
          Email: user.email || "",
          Rol: user.role || "",
          Fecha_de_Aplicativo: user.creationDate ? new Date(user.creationDate).toLocaleDateString() : "",
          Celular: user.phone || "",
          Escuela_Actual: user.currentSchool || "",
          Nivel_Educativo: user.educationLevel || "",
          Generacion: user.generation || "",
          Grado: user.grade || "",
          Grupo: user.group || "",
        };

        const respuestasFormateadas = Object.fromEntries(
          Object.entries(respuestas).map(([idPregunta, respuesta]) => {
            const pregunta = preguntas.find(p => p?._id.toString() === idPregunta);
            return [pregunta?.texto || `Pregunta ${idPregunta}`, respuesta]; // Solo guardamos el texto de la pregunta
          })
        );

        const categoriasConNombres = {};
        categorias.forEach(categoria => {
          categoriasConNombres[categoria.nombre] = ""; // Aquí solo se agrega el nombre de la categoría
      });

      return { ...userInfo, ...respuestasFormateadas, ...categoriasConNombres };
    })));

    console.log(hojaDatosIndividuales)

      // Modificar encabezados para incluir categorías
      const encabezadosIndividuales = [
        'Nombre', 'Apellido', 'Email', 'Rol', 'Fecha_de_Aplicativo',
        'Celular', 'Escuela_Actual', 'Nivel_Educativo', 'Generacion',
        'Grado', 'Grupo', ...preguntas.map(p => p.texto), // Encabezados de preguntas
        ...categorias.map(c => c.nombre) // Agregar encabezados de categorías al final
      ];

      hojaDatosIndividuales["!ref"] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: resultados.length, c: encabezadosIndividuales.length - 1 }
      });
      XLSX.utils.sheet_add_aoa(hojaDatosIndividuales, [encabezadosIndividuales], { origin: 'A1' });
      XLSX.utils.book_append_sheet(workbook, hojaDatosIndividuales, "Datos Individuales");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });
      console.log("Archivo Excel creado para test tipo 2.");

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename=Resultados_Tipo_2.xlsx`,
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    }

    // If no valid test type, respond with an error
    console.error(`Tipo de prueba no soportado: ${documento.tipo}`);
    return NextResponse.json({ error: `Tipo de prueba no soportado: ${documento.tipo}` }, { status: 400 });
  } catch (error) {
    console.error("Error al exportar resultados:", error);
    return NextResponse.json({ error: "Error al exportar resultados" }, { status: 500 });
  }
}