import { NextResponse } from "next/server";
import * as XLSX from 'xlsx';
import mongodb from '../../../../lib/mongodb';
import Resultados, { IResultados } from '../../../../models/results';
import Prueba, { IPrueba, ISeccion } from "../../../../models/testing";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation

export async function GET(request: Request, { params }: { params: { idExport: string } }) {
  const idPrueba = params.idExport || "";

  console.log('ID de prueba recibido:', idPrueba);

  // Validate 'idPrueba' parameter
  if (!idPrueba || !mongoose.Types.ObjectId.isValid(idPrueba)) {
    return NextResponse.json({ error: "El parámetro 'id' es requerido y debe ser un ObjectId válido" }, { status: 400 });
  }

  try {
    console.log('Conectando a MongoDB...');
    await mongodb(); // Connect to MongoDB
    console.log('Conexión a MongoDB exitosa.');

    // Find results associated with the test ID, populating user data
    const resultados = await (Resultados as mongoose.Model<IResultados>).find({ id_prueba: idPrueba })
      .populate('id_user', 'firstName lastName email role creationDate phone currentSchool educationLevel generation grade group');

    console.log('Resultados encontrados:', resultados);

    // Verify if there are results
    if (!resultados || resultados.length === 0) {
      return NextResponse.json({ error: `No se encontraron resultados para el ID de prueba: ${idPrueba}` }, { status: 404 });
    }

    console.log(`Buscando documento asociado a la prueba con ID: ${idPrueba}`);
    const documento = await (Prueba as mongoose.Model<IPrueba>).findById(idPrueba);  // Sin 'lean()' para evitar el problema
    if (!documento) {
      return NextResponse.json({ error: `No se encontró documento para el ID de prueba: ${idPrueba}` }, { status: 404 });
    }

    // Prepare questions from the test document
    const preguntas = (documento?.sections as unknown as ISeccion[])?.flatMap(section => section.questions) || [];

    console.log('Preguntas encontradas:', preguntas);

    // Format data for Excel export
    const data = await Promise.all(resultados.map(async (resultado) => {
      const user: any = resultado.id_user

      // Extract user-related data with fallback for empty fields
      const userInfo = {
        Nombre: user.firstName || 'N/A',
        Apellido: user.lastName || 'N/A',
        Email: user.email || 'N/A',
        Rol: user.role || 'N/A',
        Fecha_de_Aplicativo: user.creationDate ? new Date(user.creationDate).toLocaleDateString() : 'N/A',
        Celular: user.phone || 'N/A',
        Escuela_Actual: user.currentSchool || 'N/A',
        Nivel_Educativo: user.educationLevel || 'N/A',
        Generacion: user.generation || 'N/A',
        Grado: user.grade || 'N/A',
        Grupo: user.group || 'N/A'
      };

      const respuestasFormateadas = resultado.respuestas && typeof resultado.respuestas === 'object'
        ? Object.fromEntries(
          Object.entries(resultado.respuestas).map(([idPregunta, respuesta]) => {
            const pregunta: any = preguntas.find((p: any) => p?._id.toString() === idPregunta) || {};
            const textoPregunta: any = pregunta?.texto || `Pregunta ${idPregunta}`;
            console.log(`Procesando respuesta para la pregunta: ${textoPregunta}, respuesta: ${respuesta}`);
            return [textoPregunta, respuesta];
          })
        )
        : {};

      return {
        ...userInfo,
        ...respuestasFormateadas
      };
    }));

    console.log('Datos formateados para Excel:', JSON.stringify(data, null, 2));

    // Create Excel workbook and sheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    console.log('Archivo Excel creado.');

    // Set document title
    const titulo = documento?.titulo || 'Resultado';
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
