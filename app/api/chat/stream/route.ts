import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getSystemPrompt } from '@/lib/prompts';
import { createSupabaseServer } from '@/lib/supabase/server';
import { canMakeQuery } from '@/lib/limits';
import type { ChatRequest } from '@/lib/types';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, mode = 'tutor', ramo = 'general', jurisdiccion = 'Chile', sessionId, anonymous = false } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un mensaje' },
        { status: 400 }
      );
    }

    // Verificar límites
    if (anonymous) {
      // Para usuarios anónimos, verificar localStorage en el cliente
      // Por ahora permitimos el request
    } else {
      // Verificar autenticación y límites para usuarios registrados
      const supabase = await createSupabaseServer();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'No autenticado' },
          { status: 401 }
        );
      }

      // Obtener perfil del usuario
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, consultas_mes')
        .eq('id', user.id)
        .single();

      if (profile) {
        const plan = profile.plan as 'free' | 'student' | 'university';
        if (!canMakeQuery(plan, profile.consultas_mes)) {
          return NextResponse.json(
            { error: 'Has alcanzado el límite de consultas de tu plan' },
            { status: 429 }
          );
        }

        // Incrementar contador de consultas
        await supabase
          .from('profiles')
          .update({ consultas_mes: profile.consultas_mes + 1 })
          .eq('id', user.id);
      }
    }

    // Inicializar cliente de Anthropic
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    // Obtener system prompt según el modo
    const systemPrompt = getSystemPrompt(mode, ramo, jurisdiccion);

    // Formatear mensajes para Claude
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Crear stream
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: formattedMessages,
    });

    // Convertir el stream de Anthropic a un ReadableStream web-compatible
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const text = chunk.delta.text;
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Error en streaming:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Error en API chat/stream:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
