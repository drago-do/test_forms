import { Types } from "mongoose";
import { NivelEducativo } from "./carrera";

export interface Rvoe {
  tipo: string;
  estatus: string;
  numero: string;
  fechaOtorgamiento?: Date;
  fechaRetiro?: Date;
  motivoRetiro?: string;
  autorizacionRevalidaciones: {
    autorizado: boolean;
    fechaAutorizacion?: Date;
    fechaRevocacion?: Date;
  };
}

export interface Programa {
  referenciaAEntrada: Types.ObjectId;
  nombre: string;
  nivelEstudios: string;
  areaEstudios: string;
  modalidad: string;
  rvoe: Rvoe;
}

export interface Contacto {
  telefono?: string;
  lada?: string;
  correo?: string;
  sitioWeb?: string;
  redesSociales: {
    facebook?: string;
    instagram?: string;
  };
  ubicacionGoogleMaps?: string;
}

export interface Campus {
  nombre: string;
  estado: string;
  municipio: string;
  domicilio: string;
  codigoPostal: string;
}

export interface Multimedia {
  videos?: string[];
  logo?: string;
}

export interface InformacionAdicional {
  porqueEstudiarConNosotros?: string;
  experiencias?: string[];
  testimonios?: { texto: string; video: string }[];
}

export interface IEscuela {
  nombreInstitucion: string;
  razonSocial: string;
  mejoraInstitucional?: string[];
  campus: Campus;
  contacto: Contacto;
  programas: Programa[];
  multimedia?: Multimedia;
  informacionAdicional?: InformacionAdicional;
  isDeleted?: boolean;
}
