import * as XLSX from "xlsx";

function formatResultsForExcelTypeOne(testDocument, results) {
  const questions = testDocument.sections.flatMap(
    (section) => section.questions
  );
  const headers = [
    "Nombre",
    "Apellido",
    "Email",
    "FechaDeAplicativo",
    ...questions.map((q) => q.texto),
    ...testDocument.sections.map((section) => `Promedio ${section.name}`),
    ...testDocument.sections.map((section) => `Interpretacion ${section.name}`),
  ];

  const data = results.map((result) => {
    const user = result.id_user;
    const userInfo = [
      user.firstName || "",
      user.lastName || "",
      user.email || "",
      new Date(result.createdAt).toLocaleDateString(),
    ];

    const answers = questions.map(
      (question) => result.respuestas[question._id] || ""
    );

    const sectionAverages = testDocument.sections.map((section) => {
      let puntajeSeccion = 0;

      section.questions.forEach((pregunta) => {
        const respuesta = result.respuestas[pregunta._id.toString()];
        if (respuesta !== undefined) {
          const opcion = pregunta.opciones.find(
            (op) => op.valor === parseInt(respuesta)
          );
          if (opcion) {
            puntajeSeccion += opcion.valor;
          }
        }
      });

      const numPreguntas = section.questions.length;
      const PuntosTotalesDeSeccion = section?.valorMax * numPreguntas;
      const porcentajeObtenido =
        (puntajeSeccion / PuntosTotalesDeSeccion) * 100;

      return porcentajeObtenido.toFixed(2);
    });

    const sectionInterpretations = testDocument.sections.map((section) => {
      let puntajeSeccion = 0;

      section.questions.forEach((pregunta) => {
        const respuesta = result.respuestas[pregunta._id.toString()];
        if (respuesta !== undefined) {
          const opcion = pregunta.opciones.find(
            (op) => op.valor === parseInt(respuesta)
          );
          if (opcion) {
            puntajeSeccion += opcion.valor;
          }
        }
      });

      const numPreguntas = section.questions.length;
      const PuntosTotalesDeSeccion = section?.valorMax * numPreguntas;
      const numEscalas = section.escala.length;
      const brinco = PuntosTotalesDeSeccion / numEscalas;
      const escala = Math.ceil(puntajeSeccion / brinco);
      const escalaTexto =
        section.escala[escala - 1] || "Error al obtener escala";

      return escalaTexto;
    });

    return [
      ...userInfo,
      ...answers,
      ...sectionAverages,
      ...sectionInterpretations,
    ];
  });

  return { headers, data };
}

function createExcel(headers, data) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
}

export { createExcel, formatResultsForExcelTypeOne };

// const { headers, data } = formatResultsForExcel(testDocument, results);
// const excelBuffer = createExcel(headers, data);
