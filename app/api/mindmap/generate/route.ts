import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type MindMapRequest = {
  tema: string;
  ramo: string;
  jurisdiccion: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: MindMapRequest = await req.json();
    const { tema, ramo, jurisdiccion } = body;

    if (!tema || !ramo) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const prompt = `Genera un mapa mental estructurado sobre "${tema}" en el contexto de ${ramo} en ${jurisdiccion}.

REQUISITOS:
1. El mapa debe tener una estructura jerárquica clara
2. El nodo raíz es el concepto principal (${tema})
3. Cada nodo hijo debe representar un aspecto o subdivisión importante
4. Limita la profundidad a 3 niveles máximo
5. Usa entre 3-5 nodos hijos por nivel
6. Los textos deben ser concisos (máximo 8 palabras por nodo)

FORMATO DE RESPUESTA (JSON válido):
{
  "mindmap": {
    "id": "root",
    "text": "Concepto Principal",
    "color": "#3b82f6",
    "children": [
      {
        "id": "1",
        "text": "Subconcento 1",
        "color": "#8b5cf6",
        "children": [
          {
            "id": "1-1",
            "text": "Detalle 1.1",
            "color": "#ec4899",
            "children": []
          }
        ]
      }
    ]
  }
}

IMPORTANTE:
- Cada nodo debe tener: id único, text, color (hex), children (array, puede estar vacío)
- Usa colores variados de esta paleta: #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4
- El id debe ser único y jerárquico (ej: "1", "1-1", "1-1-1")
- Responde SOLO con el JSON, sin texto adicional`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3072,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Respuesta inesperada de la API');
    }

    // Extract JSON from response
    let jsonText = content.text.trim();
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const mindMapData = JSON.parse(jsonText);

    // Validate structure
    if (!mindMapData.mindmap || !mindMapData.mindmap.id || !mindMapData.mindmap.text) {
      throw new Error('Formato de mapa mental inválido');
    }

    // Validate that it has children array
    if (!Array.isArray(mindMapData.mindmap.children)) {
      mindMapData.mindmap.children = [];
    }

    return NextResponse.json(mindMapData);

  } catch (error) {
    console.error('Error generando mapa mental:', error);
    return NextResponse.json(
      { error: 'Error al generar el mapa mental' },
      { status: 500 }
    );
  }
}
