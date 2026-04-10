import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getSystemPrompt } from '@/lib/prompts';
import { createSupabaseServer } from '@/lib/supabase/server';
import { canMakeQuery } from '@/lib/limits';
import type { ChatRequest } from '@/lib/types';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Función para buscar artículos relevantes usando RAG
async function buscarArticulosRelevantes(query: string, supabase: any): Promise<string> {
  try {
    // Generar embedding de la consulta
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Buscar artículos similares
    const { data: articulos, error } = await supabase.rpc('buscar_articulos_semanticos', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5,
      filtro_codigo: null,
    });

    if (error || !articulos || articulos.length === 0) {
      return '';
    }

    // Formatear artículos como contexto
    const contextoArticulos = articulos.map((art: any) => {
      const codigoNombre = art.codigo === 'civil' ? 'Código Civil' : 'Código Penal';
      return `
📜 ${codigoNombre} - Artículo ${art.numero}
${art.libro ? `Libro: ${art.libro}` : ''}
${art.titulo ? `Título: ${art.titulo}` : ''}

${art.contenido}

Relevancia: ${(art.similarity * 100).toFixed(1)}%
      `.trim();
    }).join('\n\n---\n\n');

    return `
# LEGISLACIÓN RELEVANTE ENCONTRADA

Los siguientes artículos son relevantes para esta consulta:

${contextoArticulos}

---

IMPORTANTE:
- DEBES citar estos artículos en tu respuesta cuando sean aplicables
- Usa el formato: "Artículo XXX del Código Civil/Penal establece que..."
- Si un artículo es directamente relevante, cítalo textualmente
- No inventes artículos que no están en este contexto
    `.trim();
  } catch (error) {
    console.error('Error buscando artículos:', error);
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, mode = 'tutor', ramo = 'general', jurisdiccion = 'Chile', sessionId, anonymous = false, teacherMode = 'patient' } = body;

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

    // **RAG: Buscar artículos relevantes**
    const supabase = await createSupabaseServer();
    const ultimoMensajeUsuario = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
    const contextoRAG = await buscarArticulosRelevantes(ultimoMensajeUsuario, supabase);

    // Obtener system prompt según el modo
    let systemPrompt = getSystemPrompt(mode, ramo, jurisdiccion, undefined, teacherMode as 'patient' | 'strict');

    // Agregar contexto RAG al system prompt si hay artículos relevantes
    if (contextoRAG) {
      systemPrompt = `${systemPrompt}

${contextoRAG}`;
    }

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
