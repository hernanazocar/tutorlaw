-- ============================================
-- SCHEMA PARA RAG: LEGISLACIÓN CHILENA
-- ============================================

-- 1. Habilitar extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tabla de artículos con embeddings vectoriales
CREATE TABLE IF NOT EXISTS articulos_ley (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Metadata del artículo
  codigo TEXT NOT NULL, -- 'civil' | 'penal'
  numero TEXT NOT NULL, -- '1545', '103', etc
  titulo TEXT, -- Título del libro/sección
  libro TEXT, -- Libro IV, etc

  -- Contenido
  contenido TEXT NOT NULL, -- Texto completo del artículo
  contenido_normalizado TEXT, -- Sin tildes/mayúsculas para búsqueda

  -- Vector embedding (OpenAI text-embedding-3-small = 1536 dimensiones)
  embedding vector(1536),

  -- Metadata adicional
  url TEXT,
  fecha_actualizacion TIMESTAMP DEFAULT NOW(),

  created_at TIMESTAMP DEFAULT NOW(),

  -- Índices
  UNIQUE(codigo, numero)
);

-- 3. Índice para búsqueda vectorial (HNSW es más rápido que IVFFlat)
CREATE INDEX IF NOT EXISTS articulos_ley_embedding_idx
ON articulos_ley
USING hnsw (embedding vector_cosine_ops);

-- 4. Índice para búsqueda por código
CREATE INDEX IF NOT EXISTS articulos_ley_codigo_idx
ON articulos_ley (codigo);

-- 5. Índice para búsqueda de texto
CREATE INDEX IF NOT EXISTS articulos_ley_contenido_idx
ON articulos_ley
USING gin(to_tsvector('spanish', contenido));

-- 6. Función para búsqueda semántica
CREATE OR REPLACE FUNCTION buscar_articulos_semanticos(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  filtro_codigo text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  codigo text,
  numero text,
  titulo text,
  libro text,
  contenido text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    articulos_ley.id,
    articulos_ley.codigo,
    articulos_ley.numero,
    articulos_ley.titulo,
    articulos_ley.libro,
    articulos_ley.contenido,
    1 - (articulos_ley.embedding <=> query_embedding) as similarity
  FROM articulos_ley
  WHERE
    (filtro_codigo IS NULL OR articulos_ley.codigo = filtro_codigo)
    AND 1 - (articulos_ley.embedding <=> query_embedding) > match_threshold
  ORDER BY articulos_ley.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 7. Tabla de búsquedas (analytics)
CREATE TABLE IF NOT EXISTS busquedas_ley (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  resultados_count INT,
  articulos_encontrados JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. RLS Policies
ALTER TABLE articulos_ley ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer artículos (son públicos)
CREATE POLICY "Artículos son públicos"
  ON articulos_ley
  FOR SELECT
  USING (true);

-- Solo admins pueden insertar/actualizar
CREATE POLICY "Solo admins pueden modificar artículos"
  ON articulos_ley
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Búsquedas: usuarios solo ven las suyas
ALTER TABLE busquedas_ley ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus búsquedas"
  ON busquedas_ley
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios crean sus búsquedas"
  ON busquedas_ley
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 9. Índices de performance
CREATE INDEX IF NOT EXISTS busquedas_ley_user_idx ON busquedas_ley(user_id);
CREATE INDEX IF NOT EXISTS busquedas_ley_created_idx ON busquedas_ley(created_at DESC);

-- ============================================
-- DATOS DE PRUEBA (para testing)
-- ============================================

-- Insertar algunos artículos de ejemplo (sin embeddings por ahora)
INSERT INTO articulos_ley (codigo, numero, libro, contenido, url) VALUES
(
  'civil',
  '1545',
  'Libro IV - De las obligaciones en general y de los contratos',
  'Todo contrato legalmente celebrado es una ley para los contratantes, y no puede ser invalidado sino por su consentimiento mutuo o por causas legales.',
  'https://www.bcn.cl/leychile/navegar?idNorma=172986'
),
(
  'civil',
  '1437',
  'Libro IV - De las obligaciones en general y de los contratos',
  'Las obligaciones nacen, ya del concurso real de las voluntades de dos o más personas, como los contratos o convenciones; ya de un hecho voluntario de la persona que se obliga, como en la aceptación de una herencia o legado y en todos los cuasicontratos; ya a consecuencia de un hecho que ha inferido injuria o daño a otra persona, como en los delitos y cuasidelitos; ya por disposición de la ley, como entre los padres y los hijos sujetos a patria potestad.',
  'https://www.bcn.cl/leychile/navegar?idNorma=172986'
),
(
  'penal',
  '1',
  'Libro I - Disposiciones generales sobre los delitos',
  'Es delito toda acción u omisión voluntaria penada por la ley.',
  'https://www.bcn.cl/leychile/navegar?idNorma=1984'
)
ON CONFLICT (codigo, numero) DO NOTHING;

COMMENT ON TABLE articulos_ley IS 'Artículos de Código Civil y Penal con embeddings para RAG';
COMMENT ON COLUMN articulos_ley.embedding IS 'Vector embedding 1536-dim de OpenAI text-embedding-3-small';
COMMENT ON FUNCTION buscar_articulos_semanticos IS 'Búsqueda semántica usando similitud coseno';
