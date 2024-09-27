import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import mongodb from "../../../lib/mongodb"; 
import Resultados from "../../../models/results"; // Ajusta la ruta si es necesario
import User from "../../../models/user"; // Asegúrate de importar tu modelo de usuario

export async function GET(request) {
  const { id_prueba } = request.query; // Obtén el id_prueba desde los parámetros de la consulta

  try {
    // Consultar los resultados de MongoDB y poblar los datos del usuario
    const resultados = await Resultados.find({ id_prueba })
      .populate('id_user', 'firstName lastName email password role creationDate phone currentSchool educationLevel generation grade group')
      .lean();

    // Formatear los datos para el archivo Excel
    const data = resultados.map((r) => {
      const respuestasFormateadas = r.respuestas && typeof r.respuestas === 'object' 
        ? Object.fromEntries(Object.entries(r.respuestas)) 
        : {};

      const user = r.id_user; // Obtener el usuario poblado

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password, // Ten en cuenta la seguridad al manejar contraseñas
        role: user.role,
        creationDate: user.creationDate,
        phone: user.phone,
        currentSchool: user.currentSchool,
        educationLevel: user.educationLevel,
        generation: user.generation,
        grade: user.grade,
        group: user.group,
        ...respuestasFormateadas, // Combinar con las respuestas formateadas
      };
    });

    // Crear el libro de Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

    // Generar un buffer con el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Configurar los headers de respuesta para la descarga del archivo
    const headers = {
      "Content-Disposition": "attachment; filename=resultados.xlsx",
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    // Enviar el archivo Excel como respuesta
    return new NextResponse(excelBuffer, { headers });

  } catch (error) {
    console.error("Error al generar el archivo:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
