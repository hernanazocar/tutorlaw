import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 60; // 60 seconds timeout

type GenerateExamRequest = {
  ramo: string;
  jurisdiccion: string;
  numPreguntas: number;
};

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExamRequest = await req.json();
    const { ramo, jurisdiccion, numPreguntas } = body;

    console.log('[Exam Generator] Request:', { ramo, jurisdiccion, numPreguntas });

    if (!ramo || !numPreguntas) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('[Exam Generator] API key missing');
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const prompt = `Genera exactamente ${numPreguntas} preguntas de opción múltiple sobre ${ramo} del Derecho de ${jurisdiccion}.

RESPONDE ÚNICAMENTE CON JSON VÁLIDO EN ESTE FORMATO:

{
  "preguntas": [
    {
      "id": 1,
      "pregunta": "¿Cuál es...?",
      "opciones": ["opción A", "opción B", "opción C", "opción D"],
      "respuestaCorrecta": 0,
      "explicacion": "La respuesta correcta es A porque..."
    }
  ]
}

REGLAS:
- Exactamente ${numPreguntas} preguntas
- 4 opciones por pregunta
- respuestaCorrecta: número 0-3 (índice del array)
- NO incluyas markdown, código o texto fuera del JSON
- Solo el objeto JSON puro`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 1,
      system: 'Eres un generador de exámenes de Derecho. SIEMPRE respondes con JSON válido puro, sin texto adicional, markdown, ni código.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      console.error('[Exam Generator] Non-text response from API');
      throw new Error('Respuesta inesperada de la API');
    }

    console.log('[Exam Generator] Raw response length:', content.text.length);

    // Extraer JSON de la respuesta
    let jsonText = content.text.trim();

    // Remover markdown si existe
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Intentar encontrar el JSON si hay texto adicional
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let examData;
    try {
      examData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[Exam Generator] Error parsing JSON:', jsonText.substring(0, 200));
      return NextResponse.json(
        { error: 'Respuesta de IA no válida. Intenta de nuevo.' },
        { status: 500 }
      );
    }

    // Validar estructura
    if (!examData.preguntas || !Array.isArray(examData.preguntas)) {
      console.error('[Exam Generator] Invalid exam data structure:', examData);
      return NextResponse.json(
        { error: 'Formato de examen inválido' },
        { status: 500 }
      );
    }

    // Validar cada pregunta
    examData.preguntas.forEach((p: any, i: number) => {
      if (!p.pregunta || !Array.isArray(p.opciones) || p.opciones.length !== 4) {
        throw new Error(`Pregunta ${i + 1} tiene formato inválido`);
      }
      if (typeof p.respuestaCorrecta !== 'number' || p.respuestaCorrecta < 0 || p.respuestaCorrecta > 3) {
        throw new Error(`Pregunta ${i + 1} tiene índice de respuesta inválido`);
      }
    });

    console.log('[Exam Generator] Success! Generated', examData.preguntas.length, 'questions');
    return NextResponse.json(examData);

  } catch (error: any) {
    console.error('[Exam Generator] Error:', error);
    console.error('[Exam Generator] Error stack:', error?.stack);
    return NextResponse.json(
      { error: error.message || 'Error al generar el examen. Intenta con menos preguntas o vuelve a intentar.' },
      { status: 500 }
    );
  }
}
