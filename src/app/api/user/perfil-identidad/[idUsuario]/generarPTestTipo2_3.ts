/**
 * Calcula los promedios y las interpretaciones de las categorías en pruebas tipo 2 y 3.
 *
 * @param tests - Array de pruebas tipo 2 y 3.
 * @returns Array de resultados con categorías ordenadas de mayor a menor promedio.
 */
function calcularPromediosPorCategoria(test: any) {
  const { id_prueba, respuestas } = test;

  // Contenedores para conteos y acumulados
  const categoriasConteo: Record<string, any> = {};
  const categoriasUsuario: Record<string, any> = {};

  // Recorrer las secciones y preguntas para mapear categorías
  id_prueba.sections.forEach((section: any) => {
    section.questions.forEach((pregunta: any) => {
      pregunta.opciones.forEach((opcion: any) => {
        id_prueba.categorias.forEach((categoria: any) => {
          if (categoria.subcategorias.includes(opcion.subcategoria)) {
            if (!categoriasConteo[categoria.nombre]) {
              categoriasConteo[categoria.nombre] = {
                total: 0,
                subcategorias: {},
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

  // Mapear respuestas del usuario a categorías
  for (const [preguntaId, subcategoria] of Object.entries(respuestas)) {
    id_prueba.categorias.forEach((categoria: any) => {
      if (categoria.subcategorias.includes(subcategoria as string)) {
        if (!categoriasUsuario[categoria.nombre]) {
          categoriasUsuario[categoria.nombre] = {
            total: 0,
            subcategorias: {},
          };
        }
        if (
          !categoriasUsuario[categoria.nombre].subcategorias[
            subcategoria as string
          ]
        ) {
          categoriasUsuario[categoria.nombre].subcategorias[
            subcategoria as string
          ] = 0;
        }
        categoriasUsuario[categoria.nombre].subcategorias[
          subcategoria as string
        ]++;
        categoriasUsuario[categoria.nombre].total++;
      }
    });
  }

  // Calcular promedios para cada categoría
  const categoriasPromedio = Object.entries(categoriasUsuario).map(
    ([nombreCategoria, datosUsuario]) => {
      const totalRespuestasUsuario = datosUsuario.total;
      const totalOpcionesCategoria =
        categoriasConteo[nombreCategoria]?.total || 1;
      const promedio = (totalRespuestasUsuario / totalOpcionesCategoria) * 100;

      return {
        nombreCategoria,
        porcentaje: promedio.toFixed(2),
        subcategorias: datosUsuario.subcategorias,
      };
    }
  );

  // Ordenar las categorías por porcentaje de mayor a menor
  const categoriasOrdenadas = categoriasPromedio.sort(
    (a, b) => parseFloat(b.porcentaje) - parseFloat(a.porcentaje)
  );

  return categoriasOrdenadas;
}

function generarGraficaDeCategoriasHTML(resultados) {
  const barrasHTML = resultados
    .map((resultado) => {
      const subcategoriasHTML = Object.entries(resultado.subcategorias)
        .map(
          ([subcategoria, valor]) => `
                <div style="margin-left: 20px; font-size: 14px; color: #555;">
                    ${subcategoria}: ${valor}
                </div>
            `
        )
        .join("");

      return `
            <div style="margin: 20px 0; font-family: Arial, sans-serif;">
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">
                    ${resultado.nombreCategoria}
                </div>
                <div style="background: #f1f1f1; border-radius: 8px; overflow: hidden; height: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <div style="
                        width: ${resultado.porcentaje}%;
                        background: linear-gradient(90deg, #2196f3, #64b5f6);
                        color: white;
                        font-weight: bold;
                        text-align: right;
                        padding: 5px 10px;
                        height: 100%;
                        line-height: 30px;
                        border-radius: 8px 0 0 8px;
                        box-sizing: border-box;
                    ">
                        ${resultado.porcentaje}%
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    ${subcategoriasHTML}
                </div>
            </div>
        `;
    })
    .join("");

  return `
        <div style="width: 80%; margin: 30px auto; font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="text-align: center; color: #333; font-size: 24px;">Resultados por Categoría</h2>
            ${barrasHTML}
        </div>
    `;
}

export { calcularPromediosPorCategoria, generarGraficaDeCategoriasHTML };
