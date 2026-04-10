# 🚀 Configuración del Sistema RAG

Sistema de Retrieval-Augmented Generation (RAG) para TutorLaw con Código Civil y Penal de Chile.

## 📋 Requisitos Previos

1. **OpenAI API Key** 
   - Crea una cuenta en https://platform.openai.com
   - Genera un API key en https://platform.openai.com/api-keys
   - Costo estimado: ~$0.10 USD por setup completo

2. **Supabase Service Role Key**
   - Ve a tu proyecto en Supabase
   - Settings → API → Project API keys → `service_role` key (secret)
   - ⚠️ NO uses el `anon` key para esto

3. **pgvector activado en Supabase**
   - Ya está incluido en todos los proyectos nuevos de Supabase
   - Si tu proyecto es antiguo, ve a Database → Extensions → Habilitar `vector`

---

## 🔧 Configuración

### 1. Variables de Entorno

Agrega a tu archivo `.env.local`:

```bash
# OpenAI (para embeddings y búsqueda)
OPENAI_API_KEY=sk-...

# Supabase (las que ya tienes)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # ⬅️ NUEVA (service_role, no anon)
```

### 2. Crear Schema en Supabase

Ejecuta el SQL en Supabase:

1. Ve a tu proyecto en Supabase
2. SQL Editor → New query
3. Copia y pega el contenido de `supabase-rag-schema.sql`
4. Ejecuta (Run)

Esto creará:
- ✅ Extensión `pgvector`
- ✅ Tabla `articulos_ley` con columna vector
- ✅ Índice HNSW para búsqueda rápida
- ✅ Función `buscar_articulos_semanticos()`
- ✅ Tabla `busquedas_ley` para analytics
- ✅ RLS policies

### 3. Instalar Dependencias

```bash
npm install
```

Esto instalará:
- `openai` - Cliente de OpenAI para embeddings
- `cheerio` - Para scraping HTML
- `tsx` - Para ejecutar scripts TypeScript

---

## 📚 Ingestión de Datos

### Opción A: Setup Automático (Recomendado)

Un solo comando hace todo:

```bash
npm run setup-rag
```

Esto:
1. 🔍 Scrapea Código Civil y Penal de leychile.cl
2. 💾 Guarda en `data/articulos-leyes.json`
3. 🧠 Genera embeddings con OpenAI
4. ⬆️ Sube todo a Supabase

**Tiempo estimado:** 15-30 minutos  
**Costo:** ~$0.10 USD

### Opción B: Paso a Paso

#### 1. Scrapear legislación

```bash
npm run scrape-leyes
```

Esto descarga:
- Código Civil completo (~2,500 artículos)
- Código Penal completo (~500 artículos)

Guarda resultado en `data/articulos-leyes.json`

#### 2. Generar embeddings e insertar en DB

```bash
npm run ingest-embeddings
```

Esto:
- Lee `data/articulos-leyes.json`
- Genera embeddings de cada artículo (OpenAI)
- Inserta en Supabase con vectores

⚠️ **Importante:** Este proceso toma 15-30 minutos y usa OpenAI API (cuesta dinero).

---

## 🎯 Uso

### En el Chat

Una vez configurado, el RAG funciona automáticamente:

1. Usuario pregunta: *"¿Qué es un contrato?"*
2. Sistema busca artículos relevantes (Código Civil Art. 1437, 1545, etc.)
3. Incluye artículos en el contexto del AI
4. AI responde citando los artículos encontrados

**Ejemplo de respuesta:**

```
Según el Artículo 1437 del Código Civil, las obligaciones nacen del concurso 
real de las voluntades de dos o más personas, como en los contratos...

El Artículo 1545 establece que "todo contrato legalmente celebrado es una ley 
para los contratantes, y no puede ser invalidado sino por su consentimiento 
mutuo o por causas legales."
```

### API de Búsqueda Directa

Endpoint: `POST /api/rag/search`

```typescript
const response = await fetch('/api/rag/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'legítima defensa',
    limit: 5,
    threshold: 0.7,
    codigo: 'penal' // opcional: 'civil' | 'penal'
  })
});

const { articulos } = await response.json();
```

---

## 📊 Costos Estimados

### Setup Inicial (una sola vez)

- **Scraping:** Gratis
- **Embeddings:** ~$0.10 USD
  - ~3,000 artículos × ~100 tokens promedio = 300K tokens
  - OpenAI text-embedding-3-small: $0.02 / 1M tokens
  - 300K tokens = $0.006

### Uso Continuo

- **Búsquedas:** Prácticamente gratis
  - Cada consulta = 1 embedding (~50 tokens)
  - 1,000 consultas = $0.001

**Costo mensual estimado (1,000 estudiantes):**
- 1,000 usuarios × 50 consultas/mes = 50,000 consultas
- 50,000 × 50 tokens = 2.5M tokens
- 2.5M tokens = $0.05 USD/mes

---

## 🔍 Verificación

### 1. Verificar artículos en DB

```sql
SELECT codigo, COUNT(*) as total
FROM articulos_ley
GROUP BY codigo;
```

Deberías ver:
- `civil`: ~2,500 artículos
- `penal`: ~500 artículos

### 2. Probar búsqueda semántica

```sql
SELECT 
  codigo,
  numero,
  contenido,
  1 - (embedding <=> (SELECT embedding FROM articulos_ley WHERE numero = '1545' AND codigo = 'civil')) as similarity
FROM articulos_ley
ORDER BY similarity DESC
LIMIT 5;
```

Esto busca artículos similares al Art. 1545 (contratos).

### 3. Probar en la app

1. Ve al chat: http://localhost:3001/app/chat
2. Pregunta: "¿Qué dice el código civil sobre contratos?"
3. La respuesta debería citar artículos específicos

---

## 🐛 Troubleshooting

### Error: "pgvector extension not found"

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Error: "OPENAI_API_KEY no encontrada"

Verifica que esté en `.env.local` y reinicia el servidor:
```bash
npm run dev
```

### Error: "Function buscar_articulos_semanticos does not exist"

Ejecuta nuevamente `supabase-rag-schema.sql` en Supabase SQL Editor.

### Los artículos no se encuentran en el chat

1. Verifica que hay artículos en la DB:
   ```sql
   SELECT COUNT(*) FROM articulos_ley WHERE embedding IS NOT NULL;
   ```

2. Verifica que el threshold no sea muy alto:
   - Threshold 0.7 = 70% de similitud (recomendado)
   - Si no encuentra nada, baja a 0.5

### Performance lento en búsquedas

Verifica que el índice HNSW esté creado:
```sql
SELECT indexname FROM pg_indexes 
WHERE tablename = 'articulos_ley';
```

Deberías ver `articulos_ley_embedding_idx`.

---

## 🚀 Próximos Pasos

1. **Agregar más códigos:**
   - Código Procesal Civil
   - Código Procesal Penal
   - Código del Trabajo

2. **Jurisprudencia:**
   - Scrapear fallos de Corte Suprema
   - Usar mismo sistema de embeddings

3. **Doctrina:**
   - Agregar textos de autores chilenos
   - Abeliuk, Alessandri, etc.

4. **Analytics:**
   - Dashboard de artículos más consultados
   - Materias con más dudas

---

## 📚 Recursos

- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Supabase pgvector](https://supabase.com/docs/guides/ai/vector-columns)
- [BCN Ley Chile](https://www.bcn.cl/leychile/)

---

## ✅ Checklist

- [ ] OpenAI API key configurada
- [ ] Supabase service_role key configurada
- [ ] Schema SQL ejecutado en Supabase
- [ ] Dependencias instaladas (`npm install`)
- [ ] Códigos scrapeados (`npm run scrape-leyes`)
- [ ] Embeddings generados (`npm run ingest-embeddings`)
- [ ] Verificación: artículos en DB
- [ ] Prueba: chat cita artículos correctamente

---

**¿Problemas?** Revisa los logs de consola y verifica cada paso.
