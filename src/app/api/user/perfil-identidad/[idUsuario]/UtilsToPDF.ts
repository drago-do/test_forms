import { calcularPromediosEInterpretaciones } from "./generarPTestTipo1";
import { calcularPromediosPorCategoria } from "./generarPTestTipo2_3";

type Test = {
  _id: string;
  id_prueba: {
    tipo: number;
    [key: string]: any;
  };
  [key: string]: any;
};

/**
 * Filtra los tests por tipo.
 *
 * @param data - Lista de objetos JSON con resultados y metadata de pruebas.
 * @param tipoFiltro - Tipo de prueba a filtrar (1, 2 o 3).
 * @returns Lista de pruebas filtradas por el tipo especificado.
 */
function filtrarTestsPorTipo(data: any, tipoFiltro: number): Test[] {
  console.log("Filtrando por tipo: " + tipoFiltro);

  if (!Array.isArray(data)) {
    throw new Error("El primer argumento debe ser un array.");
  }

  if (typeof tipoFiltro !== "number") {
    throw new Error("El segundo argumento debe ser un número.");
  }

  // Filtrar los tests según el tipo
  const pruebasFiltradas = data.filter(
    (test) => test.id_prueba.tipo === tipoFiltro
  );
  return pruebasFiltradas;
}

function inyectarResultadosEnTests(tests: Test[]): any[] {
  return tests.map((test) => {
    switch (test.id_prueba.tipo) {
      case 1:
        return {
          ...test,
          resultados: calcularPromediosEInterpretaciones(test),
        };
      case 2:
      case 3:
        return {
          ...test,
          resultados: calcularPromediosPorCategoria(test),
        };
      default:
        throw new Error(`Tipo de prueba desconocido: ${test.id_prueba.tipo}`);
    }
  });
}

/**
 * Elimina las preguntas de los tests para reducir su tamaño.
 *
 * @param resultados - Array de resultados de pruebas.
 */
function eliminarPreguntasDeTests(resultados: any[]) {
  resultados.forEach((resultado) => {
    if (resultado.id_prueba && resultado.id_prueba.sections) {
      resultado.id_prueba.sections.forEach((section: any) => {
        if (section.questions) {
          section.questions = undefined;
        }
      });
    }
  });
}

/**
 * Filtra, calcula resultados y elimina preguntas de un array de pruebas.
 *
 * @param tests - Array de pruebas.
 * @returns Array con pruebas procesadas.
 */
function procesarPruebas(tests: any): any {
  // Aplicar el cálculo de resultados según el tipo de prueba
  const pruebasProcesadas = tests.map((test: any) => {
    let resultadosPromedio: any;

    switch (test.id_prueba.tipo) {
      case 1: // Tipo 1: Calcular promedios e interpretaciones
        resultadosPromedio = calcularPromediosEInterpretaciones(test);
        break;
      case 2: // Tipo 2: Calcular promedios por categoría
        resultadosPromedio = calcularPromediosPorCategoria(test);
      case 3: // Tipo 3: Calcular promedios por categoría
        resultadosPromedio = calcularPromediosPorCategoria(test);
        break;
      default:
        throw new Error(`Tipo de prueba desconocido: ${test.id_prueba.tipo}`);
    }

    // Agregar los resultados calculados a la propiedad `resultadosPromedio`
    return {
      id_prueba: test.id_prueba,
      id_user: test.id_user,
      respuestas: test.respuestas,
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
      resultadosPromedio,
    };
  });

  // Eliminar preguntas de las pruebas procesadas
  pruebasProcesadas.forEach((resultado: any) => {
    if (resultado.id_prueba && resultado.id_prueba.sections) {
      resultado.id_prueba.sections.forEach((section: any) => {
        if (section.questions) {
          section.questions = undefined;
        }
      });
    }
  });

  return pruebasProcesadas;
}

export {
  filtrarTestsPorTipo,
  inyectarResultadosEnTests,
  eliminarPreguntasDeTests,
  procesarPruebas,
};
