import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 60;

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

    const prompt = `Genera 15 preguntas de opción múltiple para evaluar conocimientos en ${ramo} de ${jurisdiccion}.

DISTRIBUCIÓN OBLIGATORIA:
- 5 preguntas nivel "básico"
- 5 preguntas nivel "intermedio"
- 5 preguntas nivel "avanzado"

RESPONDE ÚNICAMENTE CON JSON VÁLIDO EN ESTE FORMATO:

{
  "preguntas": [
    {
      "id": 1,
      "pregunta": "¿Qué es...?",
      "opciones": ["A", "B", "C", "D"],
      "respuestaCorrecta": 0,
      "ramo": "${ramo}",
      "nivel": "básico"
    }
  ]
}

REGLAS:
- Exactamente 15 preguntas (5 de cada nivel)
- 4 opciones por pregunta
- respuestaCorrecta: número 0-3
- nivel: "básico", "intermedio" o "avanzado"
- NO markdown, NO código, solo JSON puro`;

    console.log('[Assessment] Generating for:', ramo, jurisdiccion);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 1,
      system: 'Eres un generador de evaluaciones de Derecho. SIEMPRE respondes con JSON válido puro, sin texto adicional, markdown, ni código.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      console.error('[Assessment] Non-text response');
      throw new Error('Respuesta inesperada de la API');
    }

    console.log('[Assessment] Response length:', content.text.length);

    // Extract JSON from response
    let jsonText = content.text.trim();

    // Remover markdown si existe
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let assessmentData;
    try {
      assessmentData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[Assessment] JSON parse error:', jsonText.substring(0, 200));
      return NextResponse.json(
        { error: 'Respuesta de IA no válida. Intenta de nuevo.' },
        { status: 500 }
      );
    }

    // Validate structure
    if (!assessmentData.preguntas || !Array.isArray(assessmentData.preguntas)) {
      console.error('[Assessment] Invalid structure:', assessmentData);
      return NextResponse.json(
        { error: 'Formato de evaluación inválido' },
        { status: 500 }
      );
    }

    if (assessmentData.preguntas.length !== 15) {
      console.warn('[Assessment] Expected 15 questions, got:', assessmentData.preguntas.length);
      // No falla si no son exactamente 15, pero registra el warning
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

    console.log('[Assessment] Success! Generated', assessmentData.preguntas.length, 'questions');
    return NextResponse.json(assessmentData);

  } catch (error: any) {
    console.error('[Assessment] Error:', error);
    console.error('[Assessment] Error stack:', error?.stack);
    return NextResponse.json(
      { error: error.message || 'Error al generar la evaluación. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
