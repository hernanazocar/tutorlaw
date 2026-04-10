import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type AssessmentRequest = {
  ramo: string;
  jurisdiccion: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: AssessmentRequest = await req.json();
    const { ramo, jurisdiccion } = body;

    if (!ramo) {
      return NextResponse.json(
        { error: 'Se requiere especificar el ramo' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const prompt = `Genera un diagnóstico de conocimientos de 15 preguntas para evaluar el nivel de un estudiante en ${ramo} en ${jurisdiccion}.

REQUISITOS CRÍTICOS:
1. Genera EXACTAMENTE 15 preguntas distribuidas así:
   - 5 preguntas de nivel "básico" (conceptos fundamentales, definiciones)
   - 5 preguntas de nivel "intermedio" (aplicación de conceptos, casos simples)
   - 5 preguntas de nivel "avanzado" (casos complejos, análisis profundo)

2. Cada pregunta debe tener exactamente 4 opciones de respuesta
3. Las preguntas deben estar ordenadas por dificultad (básicas primero, avanzadas al final)
4. Usa casos prácticos para niveles intermedio y avanzado
5. Cita artículos cuando sea relevante

FORMATO DE RESPUESTA (JSON válido):
{
  "preguntas": [
    {
      "id": 1,
      "pregunta": "texto de la pregunta",
      "opciones": ["opción A", "opción B", "opción C", "opción D"],
      "respuestaCorrecta": 0,
      "ramo": "${ramo}",
      "nivel": "básico"
    }
  ]
}

IMPORTANTE:
- respuestaCorrecta debe ser un número del 0 al 3 (índice del array opciones)
- nivel debe ser exactamente: "básico", "intermedio" o "avanzado"
- Genera EXACTAMENTE 15 preguntas
- Responde SOLO con el JSON, sin texto adicional`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Respuesta inesperada de la API');
    }

    // Extract JSON from response
    let jsonText = content.text.trim();
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const assessmentData = JSON.parse(jsonText);

    // Validate structure
    if (!assessmentData.preguntas || !Array.isArray(assessmentData.preguntas)) {
      throw new Error('Formato de evaluación inválido');
    }

    if (assessmentData.preguntas.length !== 15) {
      throw new Error(`Se esperaban 15 preguntas, se recibieron ${assessmentData.preguntas.length}`);
    }

    // Validate each question
    assessmentData.preguntas.forEach((q: any, i: number) => {
      if (!q.pregunta || !Array.isArray(q.opciones) || q.opciones.length !== 4) {
        throw new Error(`Pregunta ${i + 1} tiene formato inválido`);
      }
      if (typeof q.respuestaCorrecta !== 'number' || q.respuestaCorrecta < 0 || q.respuestaCorrecta > 3) {
        throw new Error(`Pregunta ${i + 1} tiene índice de respuesta inválido`);
      }
      if (!['básico', 'intermedio', 'avanzado'].includes(q.nivel)) {
        q.nivel = 'intermedio'; // Default fallback
      }
      // Ensure id is set
      q.id = i + 1;
    });

    return NextResponse.json(assessmentData);

  } catch (error) {
    console.error('Error generando evaluación:', error);
    return NextResponse.json(
      { error: 'Error al generar la evaluación' },
      { status: 500 }
    );
  }
}
