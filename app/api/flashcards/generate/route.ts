import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type FlashcardRequest = {
  tema: string;
  ramo: string;
  cantidad: number;
  jurisdiccion: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: FlashcardRequest = await req.json();
    const { tema, ramo, cantidad, jurisdiccion } = body;

    if (!tema || !ramo || !cantidad) {
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

    const prompt = `Genera ${cantidad} flashcards para estudiar "${tema}" en el contexto de ${ramo} en ${jurisdiccion}.

REQUISITOS:
1. Cada flashcard debe tener una pregunta concisa en el "front" y una respuesta detallada en el "back"
2. Las preguntas deben cubrir diferentes aspectos del tema
3. Las respuestas deben ser educativas, precisas y citar artículos cuando sea relevante
4. Varía el tipo de preguntas: definiciones, ejemplos, diferencias, aplicaciones prácticas, etc.
5. Ordénalas de lo más básico a lo más complejo

FORMATO DE RESPUESTA (JSON válido):
{
  "flashcards": [
    {
      "front": "¿Qué es...?",
      "back": "Es... [explicación detallada con artículos si corresponde]"
    }
  ]
}

IMPORTANTE:
- Genera exactamente ${cantidad} flashcards
- Responde SOLO con el JSON, sin texto adicional
- Las preguntas deben ser claras y directas
- Las respuestas deben ser completas pero concisas (2-4 oraciones)`;

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

    const flashcardData = JSON.parse(jsonText);

    // Validate structure
    if (!flashcardData.flashcards || !Array.isArray(flashcardData.flashcards)) {
      throw new Error('Formato de flashcards inválido');
    }

    // Validate each flashcard
    flashcardData.flashcards.forEach((card: any, i: number) => {
      if (!card.front || !card.back) {
        throw new Error(`Flashcard ${i + 1} tiene formato inválido`);
      }
    });

    return NextResponse.json(flashcardData);

  } catch (error) {
    console.error('Error generando flashcards:', error);
    return NextResponse.json(
      { error: 'Error al generar flashcards' },
      { status: 500 }
    );
  }
}
