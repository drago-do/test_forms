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

function generarGraficaDeBarrasHTML(resultados) {
  const barrasHTML = resultados
    .map(
      (resultado) => `
        <div style="margin: 10px 0; font-family: Arial, sans-serif;">
            <div style="font-weight: bold; font-size: 10px; margin-bottom: 5px;">${resultado.nombreSeccion}</div>
            <div style="background: #f1f1f1; border-radius: 8px; overflow: hidden; height: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div style="
                    width: ${resultado.porcentaje}%;
                    background: linear-gradient(90deg, #b17200, #ffa500);
                    color: white;
                    font-weight: bold;
                    font-size: 8px;
                    text-align: right;
                    height: 100%;
                    line-height: 8px;
                    border-radius: 8px 0 0 8px;
                    box-sizing: border-box;
                ">
                    ${resultado.porcentaje}%
                </div>
            </div>
        </div>
    `
    )
    .join("");

  return `
        <div style="width: 80%; margin: 30px auto; font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="text-align: center; color: #333; font-size: 24px;">Resultados de la Prueba</h2>
            ${barrasHTML}
        </div>
    `;
}

export { calcularPromediosEInterpretaciones, generarGraficaDeBarrasHTML };
