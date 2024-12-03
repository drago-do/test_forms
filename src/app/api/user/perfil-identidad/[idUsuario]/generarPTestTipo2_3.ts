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

export { calcularPromediosPorCategoria };
