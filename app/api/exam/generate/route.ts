import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type GenerateExamRequest = {
  ramo: string;
  jurisdiccion: string;
  numPreguntas: number;
};

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExamRequest = await req.json();
    const { ramo, jurisdiccion, numPreguntas } = body;

    if (!ramo || !numPreguntas) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
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

    const prompt = `Genera un examen de ${numPreguntas} preguntas para estudiantes de Derecho sobre ${ramo} en ${jurisdiccion}.

REQUISITOS ESTRICTOS:
1. Cada pregunta debe tener exactamente 4 opciones de respuesta
2. Las preguntas deben ser desafiantes pero justas para estudiantes de pregrado
3. Incluye una explicación clara de la respuesta correcta
4. Las preguntas deben cubrir diferentes temas dentro de ${ramo}
5. Usa casos prácticos cuando sea posible

FORMATO DE RESPUESTA (JSON válido):
{
  "preguntas": [
    {
      "id": 1,
      "pregunta": "texto de la pregunta",
      "opciones": ["opción A", "opción B", "opción C", "opción D"],
      "respuestaCorrecta": 0,
      "explicacion": "explicación detallada de por qué esta es la respuesta correcta"
    }
  ]
}

IMPORTANTE:
- respuestaCorrecta debe ser un número del 0 al 3 (índice del array opciones)
- Genera exactamente ${numPreguntas} preguntas
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

    // Extraer JSON de la respuesta
    let jsonText = content.text.trim();

    // Intentar encontrar el JSON si hay texto adicional
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const examData = JSON.parse(jsonText);

    // Validar estructura
    if (!examData.preguntas || !Array.isArray(examData.preguntas)) {
      throw new Error('Formato de examen inválido');
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

    return NextResponse.json(examData);

  } catch (error) {
    console.error('Error generando examen:', error);
    return NextResponse.json(
      { error: 'Error al generar el examen' },
      { status: 500 }
    );
  }
}
