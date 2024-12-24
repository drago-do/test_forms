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

  plantillaHTML = plantillaHTML.replace(
    "{{6}}",
    generarHTMLResultadosPruebas(pruebasProcesadas)
  );
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

      // Generar gráfica según el tipo de prueba
      const graficaHTML =
        tipoPrueba === 1
          ? generarGraficaDeBarrasHTML(resultadosPromedio)
          : generarGraficaDeCategoriasHTML(resultadosPromedio);

      return `
                <div style="margin: 30px 0; font-family: Arial, sans-serif;">
                    <h2 style="text-align: center; color: #333;">${titulo}</h2>
                    <p style="text-align: justify; color: #555; margin-bottom: 20px;">${descripcion}</p>
                    <h3 style="color: #008ac9; border-bottom: 2px solid #008ac9; padding-bottom: 5px;">FORTALEZAS</h3>
                    ${mejoresHTML}
                   ${
                     tipoPrueba === 1
                       ? `<h3 style="color: #008ac9; border-bottom: 2px solid #008ac9; padding-bottom: 5px;">EN DESARROLLO</h3>
                    ${peoresHTML}`
                       : ""
                   }
                    <div style="margin-top: 30px;">
                        ${graficaHTML}
                    </div>
                </div>
            `;
    })
    .join("");
}

export {
  inyectarDatosUsuario,
  inyectarDatosPruebas,
  generarHTMLResultadosPruebas,
};
