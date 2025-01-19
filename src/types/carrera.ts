export enum NivelEducativo {
  BACHILLERATO_TECNOLOGICO = "Bachillerato Tecnológico",
  UNIVERSIDAD = "Universidad",
  POSGRADO = "Posgrado",
}

export interface ICarrera {
  nombre: string;
  nivelEducativo: NivelEducativo;
  areaAcademica: string;
  foto: string;
  videoPrincipal: string;
  videosExperiencia: string[];
  textosInformativos: {
    comoAyudaAlMundo: string;
    interesesYHabilidades: string;
    conocimientosTecnicos: string;
    dondePuedoTrabajar: string;
    competenciasAlTerminar: string;
  };
}
