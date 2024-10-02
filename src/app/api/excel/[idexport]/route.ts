import { NextResponse } from "next/server";
import * as XLSX from 'xlsx';
import mongodb from '../../../../lib/mongodb';
import Resultados from '../../../../models/results';
import { Prueba } from "../../../../models/testing";
import mongoose from "mongoose"; // Asegúrate de importar mongoose

export async function GET(request) {
  const { pathname } = request.nextUrl;
  const idPrueba = pathname.split("/").pop();

  console.log('ID de prueba recibido:', idPrueba);
  
  // Validación del parámetro 'id'
  if (!idPrueba || !mongoose.Types.ObjectId.isValid(idPrueba)) {
    return NextResponse.json({ error: "El parámetro 'id' es requerido y debe ser un ObjectId válido" }, { status: 400 });
  }

  try {
    console.log('Conectando a MongoDB...');
    await mongodb();
    console.log('Conexión a MongoDB exitosa.');

    console.log(`Buscando resultados para el ID de prueba: ${idPrueba}`);
    const resultados = await Resultados.find({ id_prueba: idPrueba }).lean();
    console.log('Resultados encontrados:', resultados);

    // Verificación de resultados
    if (!resultados || resultados.length === 0) {
      return NextResponse.json({ error: `No se encontraron resultados para el ID de prueba: ${idPrueba}` }, { status: 404 });
    }

    console.log(`Buscando documento asociado a la prueba con ID: ${idPrueba}`);
    const documento = await Resultados.findOne({ id_prueba: idPrueba }).lean();
    if (!documento) {
      return NextResponse.json({ error: `No se encontró documento para el ID de prueba: ${idPrueba}` }, { status: 404 });
    }
    
    const prueba = await Prueba.findById(documento.id_prueba).lean();
    console.log('Documento encontrado:', documento);
    
    const preguntas = prueba.sections.flatMap(section => section.questions) || [];
    console.log('Preguntas encontradas:', preguntas);

    const data = resultados.map((resultado) => {
      const respuestasFormateadas = resultado.respuestas && typeof resultado.respuestas === 'object'
        ? Object.fromEntries(
            Object.entries(resultado.respuestas).map(([idPregunta, respuesta]) => {
              const pregunta = preguntas.find(p => p._id.toString() === idPregunta) || {};
              const textoPregunta = pregunta.texto || `Pregunta ${idPregunta}`;
              console.log(`Procesando respuesta para la pregunta: ${textoPregunta}, respuesta: ${respuesta}`);
              return [`${textoPregunta}`, respuesta];
            })
          )
        : {};

      return {
        ...respuestasFormateadas 
      };
    });

    console.log('Datos formateados para Excel:', JSON.stringify(data, null, 2));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    console.log('Archivo Excel creado.');

    const titulo = documento?.documento?.titulo || 'Resultado';
    console.log('Título del documento:', titulo);

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
