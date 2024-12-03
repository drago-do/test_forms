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




export { filtrarTestsPorTipo };
