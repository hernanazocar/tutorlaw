import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// This webhook receives messages from Twilio WhatsApp
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get('From') as string; // User's WhatsApp number
    const body = formData.get('Body') as string; // Message text
    const to = formData.get('To') as string; // Twilio WhatsApp number

    if (!body) {
      return new Response('No message body', { status: 400 });
    }

    // Handle commands
    if (body.startsWith('/')) {
      const response = await handleCommand(body, from);
      return new Response(buildTwiMLResponse(response), {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    // Handle regular legal questions
    const response = await handleLegalQuery(body);
    return new Response(buildTwiMLResponse(response), {
      headers: { 'Content-Type': 'text/xml' },
    });

  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return new Response(buildTwiMLResponse('Lo siento, hubo un error. Intenta de nuevo.'), {
      headers: { 'Content-Type': 'text/xml' },
    });
  }
}

async function handleCommand(command: string, from: string): Promise<string> {
  const cmd = command.toLowerCase().trim();

  if (cmd === '/ayuda') {
    return `📚 *Comandos disponibles:*

/ayuda - Ver este mensaje
/quiz - Recibir un quiz rápido
/flashcards [tema] - Generar flashcards
/estadisticas - Ver tu progreso

También puedes escribir cualquier pregunta legal y te responderé al instante.`;
  }

  if (cmd === '/quiz') {
    return `⚡ *Quick Quiz*

Próximamente podrás recibir quizzes directamente por WhatsApp. Por ahora, visita la app web para practicar.

https://tutorlaw.com/app/chat`;
  }

  if (cmd.startsWith('/flashcards')) {
    return `🎴 *Flashcards*

Esta función estará disponible próximamente. Mientras tanto, puedes generar flashcards desde la app web.

https://tutorlaw.com/app/chat`;
  }

  if (cmd === '/estadisticas') {
    return `📊 *Tus estadísticas*

Para ver tus estadísticas detalladas, visita el dashboard en la app web.

https://tutorlaw.com/app/dashboard`;
  }

  return `❓ Comando no reconocido. Escribe /ayuda para ver los comandos disponibles.`;
}

async function handleLegalQuery(query: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return 'Error: API no configurada';
  }

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: `Eres TutorLaw, un asistente de Derecho para estudiantes chilenos.

IMPORTANTE:
- Respuestas BREVES (máximo 3-4 oraciones) aptas para WhatsApp
- Usa *negritas* para énfasis
- Cita artículos cuando sea relevante
- Sé conciso y directo
- No uses markdown complejo, solo *negritas*`,
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Respuesta inesperada');
    }

    return content.text;
  } catch (error) {
    console.error('Error processing query:', error);
    return 'Lo siento, no pude procesar tu pregunta. Intenta de nuevo.';
  }
}

function buildTwiMLResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(message)}</Message>
</Response>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
