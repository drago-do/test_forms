import { IUser } from "../../../../../models/user";
import { IResultados } from "../../../../../models/results";

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




export { inyectarDatosUsuario, inyectarDatosPruebas };
