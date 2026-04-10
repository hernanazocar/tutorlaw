/**
 * Script para combinar artículos de Código Civil y Penal
 */

import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  console.log('📚 Combinando artículos de Código Civil y Penal...\n');

  const dataDir = path.join(process.cwd(), 'data');

  // Leer archivos
  const civilPath = path.join(dataDir, 'articulos-codigo-civil.json');
  const penalPath = path.join(dataDir, 'articulos-codigo-penal.json');

  const articulosCivil = JSON.parse(await fs.readFile(civilPath, 'utf-8'));
  const articulosPenal = JSON.parse(await fs.readFile(penalPath, 'utf-8'));

  // Combinar
  const todosArticulos = [...articulosCivil, ...articulosPenal];

  console.log(`✅ Código Civil: ${articulosCivil.length} artículos`);
  console.log(`✅ Código Penal: ${articulosPenal.length} artículos`);
  console.log(`📊 Total: ${todosArticulos.length} artículos\n`);

  // Guardar combinado
  const outputPath = path.join(dataDir, 'articulos-leyes.json');
  await fs.writeFile(outputPath, JSON.stringify(todosArticulos, null, 2));

  console.log(`💾 Guardado en: ${outputPath}`);
}

main().catch(console.error);
