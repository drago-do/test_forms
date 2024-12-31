import { IUser } from "../../../../../models/user";
import { IResultados } from "../../../../../models/results";
import { generarGraficaDeBarrasHTML } from "./generarPTestTipo1";
import { generarGraficaDeCategoriasHTML } from "./generarPTestTipo2_3";
import { procesarPruebas } from "./UtilsToPDF";

function inyectarDatosUsuario(plantillaHTML: string, user: IUser): string {
  const placeholders = {
    "{{1}}": `${user.firstName} ${user.lastName}`,
    "{{2}}": user.currentSchool,
    "{{3}}": user.grade,
    "{{4}}": user.group,
  };

  for (const [key, value] of Object.entries(placeholders)) {
    const replacementValue = value || "Valor no definido";
    plantillaHTML = plantillaHTML.replace(key, replacementValue);
  }

  return plantillaHTML;
}

function inyectarDatosPruebas(
  plantillaHTML: string,
  resultados: IResultados[]
) {
  plantillaHTML = plantillaHTML.replace(
    "{{5}}",
    obtenerNombresDeLasPruebasRespondidas(resultados)
  );

  const pruebasProcesadas = procesarPruebas(resultados);

  const HTLMPrueba1y2 = generarHTMLResultadosPruebas(pruebasProcesadas);
  const HTLMPrueba2y3 = generarHTMLResultadosPruebasTipo2y3(pruebasProcesadas);
  const HTLMpruebas = HTLMPrueba1y2 + HTLMPrueba2y3;

  plantillaHTML = plantillaHTML.replace("{{6}}", HTLMpruebas);
  return plantillaHTML;
}

function obtenerNombresDeLasPruebasRespondidas(
  resultados: IResultados[]
): string {
  let html = '<ul style="list-style-type: none; padding: 0;">';

  resultados.forEach((resultado: any) => {
    const pregunta = resultado.id_prueba?.pregunta || "Pregunta no definida";
    html += `<li style="margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">${pregunta}</li>`;
  });

  html += "</ul>";
  return html;
}

function generarHTMLResultadosPruebas(pruebas: any[]): string {
  return pruebas
    .map((prueba) => {
      const { id_prueba, resultadosPromedio } = prueba;
      const tipoPrueba = id_prueba?.tipo;
      const titulo = id_prueba?.titulo || "Sin Título";
      const descripcion = id_prueba?.descripcionPDF || "Sin Descripción";
      const instrucciones = id_prueba?.instrucciones || "Sin Instrucciones";

      // Ordenar resultados por porcentaje
      const resultadosOrdenados = [...resultadosPromedio].sort(
        (a, b) => parseFloat(b.porcentaje) - parseFloat(a.porcentaje)
      );

      const mejores = resultadosOrdenados.slice(0, 3); // Mejores 3
      const peores = resultadosOrdenados.slice(-3); // Peores 3

      let cuerpoDeTest = ``;
      if (tipoPrueba === 1) {
        cuerpoDeTest = CuerpoPrueba1(mejores, peores);
      } else if (tipoPrueba === 2) {
        cuerpoDeTest = CuerpoPrueba2(mejores);
      }

      // Generar gráfica según el tipo de prueba
      const graficaHTML =
        tipoPrueba === 1
          ? generarGraficaDeBarrasHTML(resultadosPromedio)
          : generarGraficaDeCategoriasHTML(resultadosPromedio);

      return `
                <div style="margin: 30px 0; font-family: Arial, sans-serif;">
                    <h2 style="text-align: center; color: #333;">${titulo}</h2>
                    <p style="text-align: justify; color: #555; margin-bottom: 20px;">${descripcion}</p>
                   ${cuerpoDeTest}
                    <div style="margin-top: 30px;">
                        ${graficaHTML}
                    </div>
                </div>
            `;
    })
    .join("");
}

function CuerpoPrueba1(mejores: any, peores: any) {
  // Generar contenido de los mejores resultados
  const mejoresHTML = mejores
    .map(
      (resultado) => `
                    <div style="margin-bottom: 15px;">
                        <h3 style="margin: 0; font-weight: bold; font-size: 18px;">${
                          resultado.nombreSeccion || resultado.nombreCategoria
                        }</h3>
                        <p style="margin: 5px 0;">${resultado?.escala || ""}</p>
                        <p style="margin: 5px 0; color: #008ac9; font-weight: bold;">Porcentaje: ${
                          resultado.porcentaje
                        }%</p>
                    </div>
                `
    )
    .join("");

  // Generar contenido de los peores resultados
  const peoresHTML = peores
    .map(
      (resultado) => `
                    <div style="margin-bottom: 15px;">
                        <h3 style="margin: 0; font-weight: bold; font-size: 18px;">${
                          resultado.nombreSeccion || resultado.nombreCategoria
                        }</h3>
                        <p style="margin: 5px 0;">${resultado?.escala || ""}</p>
                        <p style="margin: 5px 0; color: #008ac9; font-weight: bold;">Porcentaje: ${
                          resultado.porcentaje
                        }%</p>
                    </div>
                `
    )
    .join("");
  return ` <h3 style="color: #008ac9; border-bottom: 2px solid #008ac9; padding-bottom: 5px;">FORTALEZAS</h3>
                    ${mejoresHTML}
                <h3 style="color: #008ac9; border-bottom: 2px solid #008ac9; padding-bottom: 5px;">EN DESARROLLO</h3>
                    ${peoresHTML}`;
}

function CuerpoPrueba2(mejores: any) {
  // Generar contenido de los tres mejores resultados
  const mejoresHTML = mejores
    .slice(0, 3)
    .map(
      (resultado) => `
                    <div style="margin-bottom: 15px;">
                        <h3 style="margin: 0; font-weight: bold; font-size: 18px;">${
                          resultado.nombreSeccion || resultado.nombreCategoria
                        }</h3>
                        <p style="margin: 5px 0;">${resultado?.escala || ""}</p>
                    </div>
                `
    )
    .join("");
  return `${mejoresHTML}`;
}

function generarHTMLResultadosPruebasTipo2y3(pruebas: any[]): string {
  // Filtrar pruebas de tipo 2 y 3
  const pruebasTipo2 = pruebas.filter((prueba) => prueba.id_prueba?.tipo === 2);
  const pruebasTipo3 = pruebas.filter((prueba) => prueba.id_prueba?.tipo === 3);
  console.log(pruebasTipo3);

  // Generar resumen de resultados para pruebas de tipo 2
  const resumenTipo2 = pruebasTipo2
    .map((prueba) => {
      const { id_prueba, resultadosPromedio } = prueba;
      const titulo = id_prueba?.titulo || "Sin Título";
      const descripcion = id_prueba?.descripcionPDF || "Sin Descripción";

      // Ordenar resultados por porcentaje
      const resultadosOrdenados = [...resultadosPromedio].sort(
        (a, b) => parseFloat(b.porcentaje) - parseFloat(a.porcentaje)
      );

      return `<li>✅  ${titulo}</li>`;
    })
    .join("");

  const htmlPrimeraParte = `
    <div style="font-family: Arial, sans-serif; margin: 20px;">
        <h2 style="color: #333;">ÁREAS ACADEMICAS AFINES</h2>
        <p style="text-align: justify; color: #555;">
            En México, existen alrededor de 150 licenciaturas las cuales se dividen en 5 áreas académicas:
        </p>
        <ul style="list-style-type: disc; margin-left: 20px; color: #555;">
            <li>Ciencias Biológicas, químicas y de la salud.</li>
            <li>Ciencias Físico-matemáticas y de las Ingenierías.</li>
            <li>Ciencias Sociales</li>
            <li>Humanidades y de las artes.</li>
            <li>Ciencias empresariales.</li>
        </ul>
        <p style="text-align: justify; color: #555;">
            De acuerdo a los resultados de las pruebas psicométricas, tienes ${resumenTipo2?.length} áreas académicas afines:
        </p>
        <ul style="list-style-type: none; padding: 20px;">
${resumenTipo2}
        </ul>
    </div>
    `;

  // Generar resultados para pruebas de tipo 3
  const resultadosTipo3 = pruebasTipo3
    .map((prueba) => {
      const { id_prueba, resultadosPromedio } = prueba;
      const titulo = id_prueba?.titulo || "Sin Título";
      const porcentajeGeneral =
        resultadosPromedio.reduce(
          (acc, curr) => acc + parseFloat(curr.porcentaje),
          0
        ) / resultadosPromedio.length || 0;

      // Ordenar resultados por porcentaje y tomar las 3 categorías más altas
      const categoriasOrdenadas = [...resultadosPromedio]
        .sort((a, b) => parseFloat(b.porcentaje) - parseFloat(a.porcentaje))
        .slice(0, 3);

      const resultadosHTML = categoriasOrdenadas
        .map((resultado) => {
          console.log("Aca el error ------------");
          console.log(resultado);
          const SubDeResultados = Object.keys(resultado?.subcategorias || {});

          const subcategoriasHTML = SubDeResultados.map(
            (subcategoria) => `<li>${subcategoria}</li>`
          ).join("");

          return `
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0; font-weight: bold; font-size: 18px;">
                Objeto de estudio: ${resultado.nombreCategoria} (${resultado.porcentaje}%)
              </h3>
              <p>Carreras:</p>
              <ul style="margin-left: 30px;">${subcategoriasHTML}</ul>
            </div>
          `;
        })
        .join("");

      return `
        <div style="margin: 30px 0; font-family: Arial, sans-serif;">
          <h2 style="text-align: left; color: #333;">Área académica: ${titulo} (${porcentajeGeneral.toFixed(
        2
      )}%)</h2>
          ${resultadosHTML}
        </div>
      `;
    })
    .join("");

  return `
    <div>
      <h1 style="color: #333;">CARRERAS DE ACUERDO AL ANÁLISIS PSICOMÉTRICO</h1>
      ${htmlPrimeraParte}
      <h1 style="text-align: center; color: #333;">Resultados de Pruebas Tipo 3</h1>
      ${resultadosTipo3}
    </div>
  `;
}

export {
  inyectarDatosUsuario,
  inyectarDatosPruebas,
  generarHTMLResultadosPruebas,
};
