import mongoose, { Schema, Document, model, models } from 'mongoose';

// Interfaz para la opción
export interface IOpcion extends Document {
  texto: string;
  valor: number;
  subcategoria?: string;
}

// Esquema para la opción
const opcionSchema: Schema<IOpcion> = new Schema(
  {
    texto: {
      type: String,
      required: true,
      description: 'Texto de la opción',
    },
    valor: {
      type: Number,
      required: true,
      description: 'Valor numérico asociado con la opción',
    },
    subcategoria: {
      type: String,
      default: null,
      description: 'Solo aplicable en pruebas con opciones tipo 3',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Interfaz para las preguntas
export interface IPregunta extends Document {
  texto: string;
  opciones: 'opcion_multiple' | 'verdadero_falso' | 'escala';
  respuestas: [string, boolean][];
  respuestas_correctas: string[];
  valor_maximo_individual?: number;
}

// Esquema para las preguntas
const preguntaSchema: Schema<IPregunta> = new Schema(
  {
    texto: {
      type: String,
      required: true,
    },
    opciones: {
      type: String,
      enum: ['opcion_multiple', 'verdadero_falso', 'escala'],
      required: true,
    },
    respuestas: {
      type: [[String, Boolean]],
      description: 'Array de pares [texto de respuesta, es correcta]'
    },
    respuestas_correctas: {
      type: [String],
    },
    valor_maximo_individual: {
      type: Number,
      min: 0,
      required: function() {
        return this.opciones === 'opcion_multiple' || this.opciones === 'verdadero_falso'; 
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Interfaz para la sección
export interface ISeccion extends Document {
  descripcion?: string;
  titulo: string;
  vinculo: string[];
  valorMax: number;
  preguntas: typeof preguntaSchema[]; // Referencia a preguntas
}

// Esquema para la sección
const seccionSchema: Schema<ISeccion> = new Schema(
  {
    descripcion: {
      type: String,
      description: 'Descripción de la sección',
    },
    titulo: {
      type: String,
      required: true,
      description: 'Título de la sección',
    },
    vinculo: {
      type: [String],
      description: 'Enlaces a cuestionarios o contenido relevante',
    },
    valorMax: {
      type: Number,
      required: true,
      description: 'Valor máximo para TESTS_RANGO',
    },
    preguntas: [{
      type: [preguntaSchema],
      description: 'Referencias a las preguntas asociadas a la sección',
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Esquema para la categoría
const categoriaSchema = new Schema({
  nombre: {
    type: String,
    description: 'Nombre de la categoría',
  },
  subcategorias: {
    type: [String],
    description: 'Subcategorías de la categoría',
  },
}, { _id: false }); // Evitar creación de un ID para los subdocumentos

// Interfaz para la prueba
export interface IPrueba extends Document {
  titulo: string;
  descripcion?: string;
  instrucciones: string;
  tipo: 1 | 2 | 3;
  escalas: {
    nivel: number;
    escala?: string[];
  };
  categorias: typeof categoriaSchema[]; // Referencia al esquema de categorías
  secciones: typeof seccionSchema[]; // Referencia al esquema de secciones
  creado_por: mongoose.Types.ObjectId; // Referencia al usuario creador
  fecha_creacion: Date;
}

// Esquema para la prueba
const pruebaSchema: Schema<IPrueba> = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      description: 'Título de la prueba',
    },
    descripcion: {
      type: String,
      description: 'Descripción de la prueba',
    },
    instrucciones: {
      type: String,
      description: 'Leyenda de las instrucciones',
    },
    tipo: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
      description: 'Tipo de la prueba',
    },
    escalas: {
      nivel: {
        type: Number,
        min: 0,
        description: 'Nivel de la escala',
      },
      escala: {
        type: [String],
        description: 'Escalas disponibles para la prueba',
      },
    },
    categorias: [categoriaSchema], // Usar el esquema de categoría aquí
    secciones: [{
      type: [seccionSchema],
      description: 'Referencias a las secciones asociadas a la prueba',
    }],
    creado_por: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      description: 'Referencia al creador de la prueba',
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
      description: 'Fecha de creación de la prueba',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Verificar si el modelo ya está definido antes de compilarlo
const Prueba = models.Prueba || model<IPrueba>('Prueba', pruebaSchema);

export { Prueba };
