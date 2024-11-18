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
      const sectionQuestions = section.questions.map((q) => q._id.toString());
      const sectionAnswers = sectionQuestions.map(
        (id) => result.respuestas[id] || 0
      );
      const average =
        sectionAnswers.reduce((sum, val) => sum + val, 0) /
        sectionAnswers.length;
      return average.toFixed(2);
    });

    return [...userInfo, ...answers, ...sectionAverages];
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
