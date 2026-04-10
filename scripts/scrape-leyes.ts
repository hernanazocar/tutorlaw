/**
 * Script para scrapear Código Civil y Penal de Chile desde leychile.cl
 *
 * Código Civil: https://www.bcn.cl/leychile/navegar?idNorma=172986
 * Código Penal: https://www.bcn.cl/leychile/navegar?idNorma=1984
 */

import * as cheerio from 'cheerio';

interface Articulo {
  codigo: 'civil' | 'penal';
  numero: string;
  titulo?: string;
  libro?: string;
  contenido: string;
  url: string;
}

const CODIGOS = {
  civil: {
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=172986',
    nombre: 'Código Civil',
  },
  penal: {
    url: 'https://www.bcn.cl/leychile/navegar?idNorma=1984',
    nombre: 'Código Penal',
  },
};

async function scrapeCodigoCivil(): Promise<Articulo[]> {
  console.log('🔍 Scrapeando Código Civil...');

  const response = await fetch(CODIGOS.civil.url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const articulos: Articulo[] = [];

  // Extraer artículos del HTML
  $('.articulo').each((i, elem) => {
    const numero = $(elem).find('.numero-articulo').text().trim();
    const contenido = $(elem).find('.contenido-articulo').text().trim();
    const libro = $(elem).closest('.libro').find('.titulo-libro').text().trim();

    if (numero && contenido) {
      articulos.push({
        codigo: 'civil',
        numero: numero.replace('Artículo', '').replace('Art.', '').trim(),
        libro,
        contenido,
        url: CODIGOS.civil.url,
      });
    }
  });

  console.log(`✅ ${articulos.length} artículos del Código Civil extraídos`);
  return articulos;
}

async function scrapeCodigoPenal(): Promise<Articulo[]> {
  console.log('🔍 Scrapeando Código Penal...');

  const response = await fetch(CODIGOS.penal.url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const articulos: Articulo[] = [];

  // Extraer artículos del HTML
  $('.articulo').each((i, elem) => {
    const numero = $(elem).find('.numero-articulo').text().trim();
    const contenido = $(elem).find('.contenido-articulo').text().trim();
    const titulo = $(elem).closest('.titulo').find('.texto-titulo').text().trim();

    if (numero && contenido) {
      articulos.push({
        codigo: 'penal',
        numero: numero.replace('Artículo', '').replace('Art.', '').trim(),
        titulo,
        contenido,
        url: CODIGOS.penal.url,
      });
    }
  });

  console.log(`✅ ${articulos.length} artículos del Código Penal extraídos`);
  return articulos;
}

async function main() {
  console.log('🚀 Iniciando scraping de legislación chilena...\n');

  const [articulosCivil, articulosPenal] = await Promise.all([
    scrapeCodigoCivil(),
    scrapeCodigoPenal(),
  ]);

  const todosArticulos = [...articulosCivil, ...articulosPenal];

  console.log(`\n📊 Total: ${todosArticulos.length} artículos extraídos`);
  console.log(`   - Código Civil: ${articulosCivil.length}`);
  console.log(`   - Código Penal: ${articulosPenal.length}`);

  // Guardar en JSON para revisar
  const fs = await import('fs/promises');
  await fs.writeFile(
    './data/articulos-leyes.json',
    JSON.stringify(todosArticulos, null, 2)
  );

  console.log('\n💾 Guardado en ./data/articulos-leyes.json');

  return todosArticulos;
}

if (require.main === module) {
  main().catch(console.error);
}

export { main as scrapeLeyes, type Articulo };
