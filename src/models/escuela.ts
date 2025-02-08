import { Schema, model, models, Types } from "mongoose";

const EscuelaSchema = new Schema(
  {
    nombreInstitucion: { type: String, required: true }, // Nombre de la institución
    razonSocial: { type: String, required: true }, // Razón social

    mejoraInstitucional: { type: [String] }, // Lista de grupos de mejora institucional

    campus: {
      nombre: { type: String, required: true }, // Nombre del campus o plantel
      estado: { type: String, required: true }, // Estado donde se ubica
      municipio: { type: String, required: true }, // Municipio o alcaldía
      domicilio: { type: String, required: true }, // Dirección completa
      codigoPostal: { type: String, required: true }, // Código postal
    },

    contacto: {
      telefono: { type: String }, // Teléfono de contacto
      lada: { type: String }, // Código de área
      correo: { type: String }, // Correo electrónico
      sitioWeb: { type: String }, // Sitio web oficial
      redesSociales: {
        facebook: { type: String },
        instagram: { type: String },
      },
      ubicacionGoogleMaps: { type: String }, // Enlace de ubicación en Google Maps
    },

    programas: [
      {
        referenciaAEntrada: { type: Types.ObjectId, ref: "Carrera" }, // Lista de carreras (referencias a otro modelo)
        nombre: { type: String, required: true }, // Nombre del programa educativo
        nivelEstudios: { type: String, required: true }, // Nivel de estudios (Licenciatura, Posgrado, etc.)
        areaEstudios: { type: String, required: true }, // Área académica
        modalidad: { type: String, required: true }, // Modalidad (Presencial, Online, Mixta)
        rvoe: {
          tipo: { type: String, required: true }, // Tipo de RVOE o acuerdo
          estatus: { type: String, required: true }, // Estatus del RVOE
          numero: { type: String, required: true }, // Número de RVOE o acuerdo
          fechaOtorgamiento: { type: Date }, // Fecha de otorgamiento
          fechaRetiro: { type: Date }, // Fecha de retiro
          motivoRetiro: { type: String }, // Motivo de retiro
          autorizacionRevalidaciones: {
            autorizado: { type: Boolean, required: true }, // Indica si está autorizada o no
            fechaAutorizacion: { type: Date }, // Fecha de autorización
            fechaRevocacion: { type: Date }, // Fecha de revocación
          },
        },
      },
    ],

    multimedia: {
      videos: { type: [String] }, // Lista de enlaces a videos
      logo: { type: String }, // Enlace al logo de la institución
    },

    informacionAdicional: {
      porqueEstudiarConNosotros: { type: String }, // Razón para estudiar en esta escuela
      experiencias: { type: [String] }, // Lista de experiencias
      testimonios: [{ texto: String, video: String }], // Testimonios con texto o video
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

export const Escuela = models.Escuela || model("Escuela", EscuelaSchema);
