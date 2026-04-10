import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type DebateRequest = {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  topic: string;
  ramo: string;
  jurisdiccion: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: DebateRequest = await req.json();
    const { messages, topic, ramo, jurisdiccion } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un mensaje' },
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

    const systemPrompt = `Eres un profesor de Derecho especializado en ${ramo} en ${jurisdiccion} que participa en debates orales con estudiantes.

CONTEXTO DEL DEBATE:
Tema: ${topic}

TU ROL:
1. Actúa como un oponente argumentativo constructivo
2. Presenta contraargumentos sólidos basados en la ley
3. Haz preguntas socráticas para que el estudiante profundice
4. Cita artículos y jurisprudencia cuando sea relevante
5. Mantén un tono respetuoso pero desafiante

FORMATO DE RESPUESTA:
- Respuestas concisas (2-4 oraciones máximo) aptas para síntesis de voz
- Evita texto muy largo o listas extensas
- Usa un lenguaje natural y conversacional
- Termina con una pregunta o desafío para continuar el debate

IMPORTANTE:
- Esta es una conversación ORAL, mantén respuestas breves
- Enfócate en argumentar, no en explicar teoría
- Desafía las posiciones del estudiante constructivamente
- Ayuda a desarrollar pensamiento crítico`;

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: formattedMessages,
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Respuesta inesperada de la API');
    }

    return NextResponse.json({ response: content.text });

  } catch (error) {
    console.error('Error en API debate:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
