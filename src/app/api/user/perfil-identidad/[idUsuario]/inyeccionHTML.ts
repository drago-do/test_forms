import { IUser } from "../../../../../models/user";

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

export { inyectarDatosUsuario };
