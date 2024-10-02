import { NextResponse } from "next/server";
import * as XLSX from 'xlsx';
import mongodb from '../../../../lib/mongodb';
import Resultados from '../../../../models/results';
import { Prueba } from "../../../../models/testing";

export async function GET(request) {
  // Obtener el ID de la prueba desde la URL
  const { pathname } = request.nextUrl;
  const idPrueba = pathname.split("/").pop(); // Extraer el último segmento de la URL como el ID

  // Validación del parámetro 'id'
  if (!idPrueba) {
    return NextResponse.json({ error: "El parámetro 'id' es requerido" }, { status: 400 });
  }

  try {
    // Conexión a MongoDB
    await mongodb();

    // Buscar resultados asociados al 'id_prueba' con populate en 'id_user'
    const resultados = await Resultados.find({ id_prueba: idPrueba })
      .populate('id_user', 'firstName lastName email role creationDate phone currentSchool educationLevel generation grade group')
      .lean();

    // Verificación de resultados
    if (!resultados || resultados.length === 0) {
      return NextResponse.json({ error: `No se encontraron resultados para el ID de prueba: ${idPrueba}` }, { status: 404 });
    }

    // Obtener el documento asociado a la prueba (buscando por id_prueba)
    const documento = await Resultados.findOne({ id_prueba: idPrueba }).lean();
    const prueba = await Prueba.findById(documento.id_prueba).lean();

    // Imprimir en consola las preguntas y sus respuestas
    const preguntas = prueba.sections.flatMap(section => section.questions) || []; // Asegurarse de acceder a las preguntas desde las secciones

    // Imprimir en consola los resultados recuperados
    console.log('Resultados recuperados:', JSON.stringify(resultados, null, 2));

    // Formatear datos para exportar a Excel
    const data = resultados.map((resultado) => {
      const user = resultado.id_user || {};

      // Obtener las respuestas y mapearlas para obtener el texto de la pregunta como clave
      const respuestasFormateadas = resultado.respuestas && typeof resultado.respuestas === 'object'
        ? Object.fromEntries(
            Object.entries(resultado.respuestas).map(([idPregunta, respuesta]) => {
              // Obtener el texto de la pregunta del documento utilizando el idPregunta
              const pregunta = preguntas.find(p => p._id.toString() === idPregunta) || {};
              const textoPregunta = pregunta.texto || `Pregunta ${idPregunta}`; // Usar texto de pregunta si existe, de lo contrario usar un texto predeterminado
              return [`${textoPregunta}`, respuesta]; // Mapear el texto de la pregunta a su respuesta
            })
          )
        : {};
        
      return {
        Nombre: user.firstName || '',
        Apellido: user.lastName || '',
        Email: user.email || '',
        Rol: user.role || '',
        Fecha_de_Aplicativo: user.creationDate || '',
        Celular: user.phone || '',
        Escuela_Actual: user.currentSchool || '',
        Nivel_Educativo: user.educationLevel || '',
        Generacion: user.generation || '',
        Grado: user.grade || '',
        Grupo: user.group || '',
        ...respuestasFormateadas 
      };
    });

    // Crear el archivo Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

    // Escribir el archivo Excel en un buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Obtener el título del documento para usar en el nombre del archivo
    const titulo = documento?.documento?.titulo || 'Resultado';

    // Enviar la respuesta con el archivo Excel
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename=Resultado_Tests_${titulo}.xlsx`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error al generar el archivo Excel:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
