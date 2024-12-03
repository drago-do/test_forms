/**
 * Calcula los promedios y las interpretaciones de las secciones en pruebas tipo 1.
 *
 * @param tests - Array de pruebas tipo 1.
 * @returns Array de resultados con secciones ordenadas de mayor a menor porcentaje.
 */
function calcularPromediosEInterpretaciones(test: any) {
  const { id_prueba, respuestas } = test;

  const resultadosSecciones = id_prueba.sections.map((section: any) => {
    // Obtener las preguntas de la sección
    const preguntasIds = section.questions.map((pregunta: any) => pregunta._id);

    // Calcular el puntaje obtenido
    let puntajeSeccion = 0;
    let totalPreguntas = 0;

    preguntasIds.forEach((preguntaId: string) => {
      const respuesta = respuestas[preguntaId];
      if (respuesta) {
        const pregunta = section.questions.find(
          (q: any) => q._id === preguntaId
        );
        const opcion = pregunta.opciones.find(
          (op: any) => op.valor === parseInt(respuesta, 10)
        );
        if (opcion) {
          puntajeSeccion += opcion.valor;
          totalPreguntas++;
        }
      }
    });

    // Calcular el total de puntos posibles en la sección
    const puntosTotales = totalPreguntas * section.valorMax;

    // Calcular el promedio (porcentaje)
    const promedio =
      puntosTotales > 0 ? (puntajeSeccion / puntosTotales) * 100 : 0;

    // Calcular la interpretación según la escala
    const escalaIndex = Math.min(
      section.escala.length - 1,
      Math.floor((promedio / 100) * section.escala.length)
    );
    const interpretacion = section.escala[escalaIndex] || "No disponible";

    return {
      nombreSeccion: section.name.trim(),
      porcentaje: promedio.toFixed(2),
      escala: interpretacion,
    };
  });

  // Ordenar las secciones por porcentaje de mayor a menor
  const resultadosOrdenados = resultadosSecciones.sort(
    (a: any, b: any) => parseFloat(b.porcentaje) - parseFloat(a.porcentaje)
  );

  return resultadosOrdenados;
}

export { calcularPromediosEInterpretaciones };
