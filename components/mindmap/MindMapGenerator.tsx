'use client';

import { useState } from 'react';
import { BrainIcon } from '@/components/ui/Icons';

type MindMapNode = {
  id: string;
  text: string;
  children: MindMapNode[];
  color: string;
};

interface MindMapGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  jurisdiccion: string;
}

export function MindMapGenerator({ isOpen, onClose, jurisdiccion }: MindMapGeneratorProps) {
  const [tema, setTema] = useState('');
  const [ramo, setRamo] = useState('Derecho Civil');
  const [mindMap, setMindMap] = useState<MindMapNode | null>(null);
  const [loading, setLoading] = useState(false);

  const ramos = [
    'Derecho Civil',
    'Derecho Penal',
    'Derecho Constitucional',
    'Derecho Procesal',
    'Derecho Comercial',
    'Derecho Laboral',
  ];

  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // green
    '#06b6d4', // cyan
  ];

  const handleGenerate = async () => {
    if (!tema.trim()) {
      alert('Por favor ingresa un tema');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/mindmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema,
          ramo,
          jurisdiccion,
        }),
      });

      if (!response.ok) throw new Error('Error generando mapa mental');

      const data = await response.json();
      setMindMap(data.mindmap);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el mapa mental. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const renderNode = (node: MindMapNode, level: number = 0, index: number = 0) => {
    const isRoot = level === 0;
    const offsetX = level * 280;
    const offsetY = index * 100;

    return (
      <div key={node.id} className="relative">
        {/* Node */}
        <div
          className={`relative z-10 ${
            isRoot
              ? 'p-6 rounded-2xl shadow-xl text-xl font-bold'
              : 'p-4 rounded-xl shadow-lg text-sm font-semibold'
          } text-white transition-transform hover:scale-105 cursor-pointer`}
          style={{
            backgroundColor: node.color,
            marginLeft: isRoot ? 0 : `${level * 20}px`,
          }}
        >
          {node.text}
        </div>

        {/* Children */}
        {node.children && node.children.length > 0 && (
          <div className="ml-8 mt-4 space-y-4 border-l-2 border-gray-300 pl-6">
            {node.children.map((child, i) => renderNode(child, level + 1, i))}
          </div>
        )}
      </div>
    );
  };

  const exportAsSVG = () => {
    if (!mindMap) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '1200');
    svg.setAttribute('height', '800');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Add background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '1200');
    bg.setAttribute('height', '800');
    bg.setAttribute('fill', '#f9fafb');
    svg.appendChild(bg);

    // Render nodes recursively
    const renderSVGNode = (node: MindMapNode, x: number, y: number, level: number) => {
      const isRoot = level === 0;
      const width = isRoot ? 200 : 180;
      const height = isRoot ? 80 : 60;

      // Node rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', width.toString());
      rect.setAttribute('height', height.toString());
      rect.setAttribute('rx', isRoot ? '16' : '12');
      rect.setAttribute('fill', node.color);
      svg.appendChild(rect);

      // Node text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (x + width / 2).toString());
      text.setAttribute('y', (y + height / 2 + 5).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', isRoot ? '16' : '12');
      text.setAttribute('font-weight', 'bold');
      text.textContent = node.text.length > 25 ? node.text.substring(0, 25) + '...' : node.text;
      svg.appendChild(text);

      // Children
      if (node.children && node.children.length > 0) {
        const childX = x + width + 100;
        const startY = y - ((node.children.length - 1) * 100) / 2;

        node.children.forEach((child, i) => {
          const childY = startY + i * 100;

          // Connection line
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', (x + width).toString());
          line.setAttribute('y1', (y + height / 2).toString());
          line.setAttribute('x2', childX.toString());
          line.setAttribute('y2', (childY + height / 2).toString());
          line.setAttribute('stroke', '#d1d5db');
          line.setAttribute('stroke-width', '2');
          svg.appendChild(line);

          renderSVGNode(child, childX, childY, level + 1);
        });
      }
    };

    renderSVGNode(mindMap, 50, 50, 0);

    // Convert to blob and download
    const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mapa-mental-${tema.replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    if (!mindMap) return;

    const renderTextNode = (node: MindMapNode, level: number = 0): string => {
      const indent = '  '.repeat(level);
      let text = `${indent}${level === 0 ? '# ' : '- '}${node.text}\n`;

      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          text += renderTextNode(child, level + 1);
        });
      }

      return text;
    };

    const textContent = renderTextNode(mindMap);
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mapa-mental-${tema.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BrainIcon className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Mapas Mentales</h2>
              </div>
              <p className="text-green-100 text-sm">Visualiza conceptos jurídicos de forma clara</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!mindMap ? (
            /* Setup Form */
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tema o concepto
                </label>
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ej: Contratos, Responsabilidad civil, Derechos fundamentales..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ramo
                </label>
                <select
                  value={ramo}
                  onChange={(e) => setRamo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {ramos.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">¿Cómo funciona?</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Ingresa el tema que quieres visualizar</li>
                  <li>• La IA generará un mapa mental estructurado</li>
                  <li>• Explora los conceptos principales y sus ramificaciones</li>
                  <li>• Exporta el mapa en formato SVG o TXT</li>
                </ul>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !tema.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? 'Generando mapa mental...' : 'Generar Mapa Mental'}
              </button>
            </div>
          ) : (
            /* Mind Map Viewer */
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Mapa Mental: {tema}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={exportAsSVG}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                  >
                    Exportar SVG
                  </button>
                  <button
                    onClick={exportAsText}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold"
                  >
                    Exportar TXT
                  </button>
                  <button
                    onClick={() => {
                      setMindMap(null);
                      setTema('');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-semibold"
                  >
                    Nuevo Mapa
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 overflow-x-auto">
                {renderNode(mindMap)}
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Usa este mapa mental para entender la estructura del tema.
                  Cada rama representa un concepto clave y sus subdivisiones.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
