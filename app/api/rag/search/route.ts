import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query, limit = 5, threshold = 0.7, codigo } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query requerido' }, { status: 400 });
    }

    // 1. Generar embedding de la consulta
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Buscar artículos similares en Supabase
    const cookieStore = await cookies();
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/\s+/g, '');

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Ignore
          }
        },
      },
    });

    const { data: articulos, error } = await supabase.rpc('buscar_articulos_semanticos', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
      filtro_codigo: codigo || null,
    });

    if (error) {
      console.error('Error buscando artículos:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Guardar búsqueda en analytics (opcional)
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from('busquedas_ley').insert({
        user_id: user.id,
        query,
        resultados_count: articulos?.length || 0,
        articulos_encontrados: articulos || [],
      });
    }

    return NextResponse.json({
      query,
      articulos: articulos || [],
      count: articulos?.length || 0,
    });

  } catch (error: any) {
    console.error('Error en RAG search:', error);
    return NextResponse.json(
      { error: error.message || 'Error en búsqueda' },
      { status: 500 }
    );
  }
}
