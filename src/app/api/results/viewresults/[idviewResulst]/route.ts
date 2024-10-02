import { NextResponse } from "next/server";
import mongodb from '../../../../../lib/mongodb';
import Resultados from '../../../../../models/results';
import { Prueba } from '../../../../../models/testing';

// Método GET: Recuperar los resultados de la prueba
export async function GET(request: Request, { params }: { params: { idviewResulst: string } }) {
    try {
        const id_prueba = params.idviewResulst; // Obtener id de la prueba desde los parámetros

        // Obtener los resultados de la prueba y procesarlos
        const response = await obtenerResultadosPrueba(id_prueba);

        if (response.error) {
            return NextResponse.json(response, { status: 404 });
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error en GET:', error);
        return NextResponse.json({ error: "Error al obtener los resultados." }, { status: 500 });
    }
}

// Función principal para obtener los resultados de una prueba
export async function obtenerResultadosPrueba(id_prueba: string) {
    try {
        // Conectarse a la base de datos
        await mongodb();

        // Obtener la prueba correspondiente
        const prueba = await Prueba.findById(id_prueba).lean();
        if (!prueba) {
            return { error: 'No se encontró la prueba.' };
        }

        // Obtener los resultados de la prueba para ese id_prueba
        const resultados = await Resultados.findOne({ id_prueba }).lean();

        if (!resultados) {
            return { error: 'No se encontraron resultados para esta prueba.' };
        }

        // Clasificar las preguntas por secciones y calcular el porcentaje y escala
        const respuestas = resultados.respuestas; // Se trata como un objeto normal
        const seccionesResultado: any[] = [];

        prueba.sections.forEach((seccion) => {
            let puntajeSeccion = 0;
            const totalPreguntas = seccion.questions.length;

            // Obtener el puntaje de la sección comparando las respuestas
            seccion.questions.forEach((pregunta: any) => {
                const respuesta = respuestas[pregunta._id.toString()]; // Acceso como objeto
                if (respuesta !== undefined) {
                    const opcion = pregunta.opciones.find((op: any) => op.valor === respuesta);
                    if (opcion) {
                        puntajeSeccion += opcion.valor;
                    }
                }
            });

            // Calcular el porcentaje obtenido para la sección
            const porcentajeObtenido = (puntajeSeccion / seccion.valorMax) * 100;

            // Calcular la escala
            const numEscalas = prueba.escalas.nivel;
            const brinco = seccion.valorMax / numEscalas;
            let escala = Math.ceil(puntajeSeccion / brinco);

            if (escala > numEscalas) {
                escala = numEscalas; // En caso de que exceda el número de escalas
            }

            // Añadir la información de la sección al resultado
            seccionesResultado.push({
                nombreSeccion: seccion.name,
                porcentaje: porcentajeObtenido.toFixed(2),
                escala,
                enlaces: seccion.link, // Asumiendo que link es un array de strings
            });
        });

        // Retornar el JSON final con los resultados procesados
        return { secciones: seccionesResultado };
    } catch (error) {
        console.error('Error obteniendo los resultados de la prueba:', error);
        return { error: 'Error interno del servidor.' };
    }
}
