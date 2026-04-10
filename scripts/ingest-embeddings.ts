/**
 * Script para generar embeddings de artículos y cargarlos a Supabase
 *
 * Uso:
 *   npm run ingest-embeddings
 */

import dotenv from 'dotenv';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Necesitas service role key
);

interface Articulo {
  codigo: 'civil' | 'penal';
  numero: string;
  titulo?: string;
  libro?: string;
  contenido: string;
  url: string;
}

async function generarEmbedding(texto: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // 1536 dimensiones, más barato
    input: texto,
  });

  return response.data[0].embedding;
}

async function procesarArticulosBatch(articulos: Articulo[], batchSize = 100) {
  console.log(`📦 Procesando ${articulos.length} artículos en batches de ${batchSize}...`);

  for (let i = 0; i < articulos.length; i += batchSize) {
    const batch = articulos.slice(i, i + batchSize);
    console.log(`\n🔄 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(articulos.length / batchSize)}`);

    const articulosConEmbeddings = await Promise.all(
      batch.map(async (articulo, index) => {
        try {
          // Crear texto completo para embedding
          const textoCompleto = `
${articulo.codigo === 'civil' ? 'Código Civil' : 'Código Penal'} - Artículo ${articulo.numero}
${articulo.libro ? `Libro: ${articulo.libro}` : ''}
${articulo.titulo ? `Título: ${articulo.titulo}` : ''}

${articulo.contenido}
          `.trim();

          const embedding = await generarEmbedding(textoCompleto);

          console.log(`  ✓ ${articulo.codigo.toUpperCase()} Art. ${articulo.numero}`);

          return {
            codigo: articulo.codigo,
            numero: articulo.numero,
            titulo: articulo.titulo,
            libro: articulo.libro,
            contenido: articulo.contenido,
            contenido_normalizado: articulo.contenido.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            embedding,
            url: articulo.url,
          };
        } catch (error) {
          console.error(`  ✗ Error en ${articulo.codigo} Art. ${articulo.numero}:`, error);
          return null;
        }
      })
    );

    // Filtrar nulls
    const articulosValidos = articulosConEmbeddings.filter(a => a !== null);

    // Insertar en Supabase
    if (articulosValidos.length > 0) {
      const { error } = await supabase
        .from('articulos_ley')
        .upsert(articulosValidos, {
          onConflict: 'codigo,numero',
        });

      if (error) {
        console.error('❌ Error insertando batch:', error);
      } else {
        console.log(`  💾 ${articulosValidos.length} artículos guardados en Supabase`);
      }
    }

    // Rate limiting: pausa entre batches
    if (i + batchSize < articulos.length) {
      console.log('  ⏳ Esperando 2s antes del siguiente batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function main() {
  console.log('🚀 Iniciando generación de embeddings...\n');

  // 1. Leer artículos del JSON
  const dataPath = path.join(process.cwd(), 'data', 'articulos-leyes.json');

  let articulos: Articulo[];
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    articulos = JSON.parse(data);
    console.log(`📄 ${articulos.length} artículos cargados desde ${dataPath}\n`);
  } catch (error) {
    console.error('❌ Error leyendo articulos-leyes.json');
    console.error('   Ejecuta primero: npm run scrape-leyes');
    process.exit(1);
  }

  // 2. Verificar variables de entorno
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY no encontrada');
    process.exit(1);
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY no encontrada');
    console.error('   Necesitas el service_role key de Supabase (no el anon key)');
    process.exit(1);
  }

  // 3. Procesar artículos
  await procesarArticulosBatch(articulos);

  // 4. Verificar resultados
  const { count } = await supabase
    .from('articulos_ley')
    .select('*', { count: 'exact', head: true });

  console.log('\n✅ Proceso completado!');
  console.log(`📊 Total artículos en DB: ${count}`);

  // 5. Costos estimados
  const tokens = articulos.reduce((sum, a) => sum + a.contenido.length / 4, 0);
  const costoEmbeddings = (tokens / 1_000_000) * 0.13;
  console.log(`💰 Costo estimado embeddings: $${costoEmbeddings.toFixed(4)} USD`);
}

if (require.main === module) {
  main().catch(console.error);
}

export { procesarArticulosBatch };
