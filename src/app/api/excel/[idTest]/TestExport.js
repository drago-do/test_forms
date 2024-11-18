import * as XLSX from "xlsx";

function formatResultsForExcelTypeOne(testDocument, results) {
  const questions = testDocument.sections.flatMap(
    (section) => section.questions
  );
  const headers = [
    "Nombre",
    "Apellido",
    "Email",
    "Telefono",
    "Escuela",
    "Nivel",
    "Generacion",
    "Grado",
    "Grupo",
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
      user.phone || "",
      user.currentSchool || "",
      user.educationLevel || "",
      user.generation || "",
      user.grade || "",
      user.group || "",
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
function formatResultsForExcelTypeTwo(testDocument, results) {
  const questions = testDocument.sections.flatMap(
    (section) => section.questions
  );
  const categoriesName = testDocument.categorias.flatMap((categoria) => [
    categoria.nombre,
  ]);
  const headers = [
    "Nombre",
    "Apellido",
    "Email",
    "Telefono",
    "Escuela",
    "Nivel",
    "Generacion",
    "Grado",
    "Grupo",
    "FechaDeAplicativo",
    ...questions.map((q) => q.texto),
    ...testDocument.categorias.flatMap((categoria) => [
      `Total:${categoria.nombre}`,
    ]),
    ...testDocument.categorias.flatMap((categoria) => [
      `Usuario:${categoria.nombre}`,
    ]),
    ...testDocument.categorias.flatMap((categoria) => [
      `Promedio:${categoria.nombre}`,
    ]),
  ];

  const data = results.map((result) => {
    const user = result.id_user;
    const userInfo = [
      user.firstName || "",
      user.lastName || "",
      user.email || "",
      user.phone || "",
      user.currentSchool || "",
      user.educationLevel || "",
      user.generation || "",
      user.grade || "",
      user.group || "",
      new Date(result.createdAt).toLocaleDateString(),
    ];

    const answers = questions.map(
      (question) => result.respuestas[question._id] || ""
    );

    const categoriasConteo = {};
    const categoriasUsuario = {};

    testDocument.sections.forEach((section) => {
      section.questions.forEach((pregunta) => {
        pregunta.opciones.forEach((opcion) => {
          testDocument.categorias.forEach((categoria) => {
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
    });

    for (const [preguntaId, subcategoria] of Object.entries(
      result.respuestas
    )) {
      for (const categoria of testDocument.categorias) {
        if (categoria.subcategorias.includes(subcategoria)) {
          if (!categoriasUsuario[categoria.nombre]) {
            categoriasUsuario[categoria.nombre] = {
              subcategorias: {},
              total: 0,
              enlaces: categoria.link || [],
            };
          }
          if (
            !categoriasUsuario[categoria.nombre].subcategorias[subcategoria]
          ) {
            categoriasUsuario[categoria.nombre].subcategorias[subcategoria] = 0;
          }
          categoriasUsuario[categoria.nombre].subcategorias[subcategoria]++;
          categoriasUsuario[categoria.nombre].total++;
        }
      }
    }

    const categoriasPromedio = {};
    for (const [nombreCategoria, conteo] of Object.entries(categoriasUsuario)) {
      const totalRespuestas = conteo.total;
      const totalOpciones = categoriasConteo[nombreCategoria]?.total || 1;
      const promedio = (totalRespuestas / totalOpciones) * 100;
      categoriasPromedio[nombreCategoria] = {
        promedio: promedio.toFixed(2),
        ...conteo,
      };
    }

    const categoriasPromedioOrdenadas = Object.entries(categoriasPromedio)
      .sort(([, a], [, b]) => parseFloat(b.promedio) - parseFloat(a.promedio))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const getTotalCategorias = (jsonInput, categoryNames) => {
      return categoryNames.map((name) => jsonInput[name]?.total || 0);
    };
    const getTotalUser = (jsonInput, categoryNames) => {
      return categoryNames.map((name) => jsonInput[name]?.total || 0);
    };
    const getTotalPromedio = (jsonInput, categoryNames) => {
      return categoryNames.map((name) => jsonInput[name]?.promedio || "0.00");
    };

    const totalCategorias = getTotalCategorias(
      categoriasConteo,
      categoriesName
    );
    const totalUsuario = getTotalUser(categoriasUsuario, categoriesName);
    const totalPromedio = getTotalPromedio(
      categoriasPromedioOrdenadas,
      categoriesName
    );

    return [
      ...userInfo,
      ...answers,
      ...totalCategorias,
      ...totalUsuario,
      ...totalPromedio,
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

export {
  createExcel,
  formatResultsForExcelTypeOne,
  formatResultsForExcelTypeTwo,
};

// const { headers, data } = formatResultsForExcel(testDocument, results);
// const excelBuffer = createExcel(headers, data);
