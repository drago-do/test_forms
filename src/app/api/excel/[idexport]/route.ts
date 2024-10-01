import { NextResponse } from "next/server";
import * as XLSX from 'xlsx';
import mongodb from '../../../../lib/mongodb';
import Resultados from '../../../../models/results';

export async function GET(request) {
  // Obtener el ID de la prueba desde la URL
  const { pathname } = request.nextUrl;
  const idPrueba = pathname.split("/").pop();  // Extraer el último segmento de la URL como el ID

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

    // Formatear datos para exportar a Excel
    const data = resultados.map((resultado) => {
      const user = resultado.id_user || {};
      const respuestasFormateadas = resultado.respuestas && typeof resultado.respuestas === 'object'
        ? Object.fromEntries(Object.entries(resultado.respuestas)) // Convierte las respuestas en pares clave-valor
        : {};

      return {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        creationDate: user.creationDate || '',
        phone: user.phone || '',
        currentSchool: user.currentSchool || '',
        educationLevel: user.educationLevel || '',
        generation: user.generation || '',
        grade: user.grade || '',
        group: user.group || '',
        ...respuestasFormateadas,  // Incluir las respuestas formateadas
      };
    });

    // Crear el archivo Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

    // Escribir el archivo Excel en un buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Enviar la respuesta con el archivo Excel
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename=resultados_prueba_${idPrueba}.xlsx`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error al generar el archivo Excel:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
