import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type DailyChallengeRequest = {
  jurisdiccion: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: DailyChallengeRequest = await req.json();
    const { jurisdiccion } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    // Determine today's focus area (rotates daily)
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const ramos = ['Derecho Civil', 'Derecho Penal', 'Derecho Constitucional', 'Derecho Procesal', 'Derecho Comercial'];
    const ramoDelDia = ramos[dayOfYear % ramos.length];

    const prompt = `Genera un desafío diario para estudiantes de Derecho en ${jurisdiccion}.

TEMA DEL DÍA: ${ramoDelDia}

REQUISITOS:
1. La pregunta debe ser desafiante pero justa para estudiantes de pregrado
2. Debe ser una pregunta práctica o caso corto, no solo teoría
3. Incluye 4 opciones de respuesta (solo una correcta)
4. La explicación debe ser educativa y citar artículos cuando sea relevante
5. Evalúa la dificultad honestamente (fácil/medio/difícil)

FORMATO DE RESPUESTA (JSON válido):
{
  "pregunta": "texto de la pregunta o caso",
  "opciones": ["opción A", "opción B", "opción C", "opción D"],
  "respuestaCorrecta": 0,
  "explicacion": "explicación detallada de por qué esta es la respuesta correcta, citando artículos si corresponde",
  "ramo": "${ramoDelDia}",
  "dificultad": "medio"
}

IMPORTANTE:
- respuestaCorrecta debe ser un número del 0 al 3 (índice del array opciones)
- dificultad debe ser exactamente: "fácil", "medio" o "difícil"
- Responde SOLO con el JSON, sin texto adicional`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
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

    const challengeData = JSON.parse(jsonText);

    // Validate structure
    if (!challengeData.pregunta || !Array.isArray(challengeData.opciones) || challengeData.opciones.length !== 4) {
      throw new Error('Formato de desafío inválido');
    }

    if (typeof challengeData.respuestaCorrecta !== 'number' ||
        challengeData.respuestaCorrecta < 0 ||
        challengeData.respuestaCorrecta > 3) {
      throw new Error('Respuesta correcta inválida');
    }

    if (!['fácil', 'medio', 'difícil'].includes(challengeData.dificultad)) {
      challengeData.dificultad = 'medio'; // Default
    }

    return NextResponse.json(challengeData);

  } catch (error) {
    console.error('Error generando desafío:', error);
    return NextResponse.json(
      { error: 'Error al generar el desafío' },
      { status: 500 }
    );
  }
}
