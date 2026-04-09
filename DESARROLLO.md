# TutorLaw - Estado del Desarrollo

## ✅ Fase 1 - Base (COMPLETADA)

### Implementado:

1. **Proyecto Next.js 14 inicializado**
   - TypeScript
   - Tailwind CSS v4
   - App Router
   - Estructura de carpetas según spec

2. **Dependencias instaladas**
   - `@anthropic-ai/sdk` - Cliente de Claude
   - `@supabase/supabase-js` - Cliente de Supabase
   - `@supabase/ssr` - Auth para Next.js App Router
   - `recharts` - Gráficos (para dashboard futuro)

3. **Configuración de entorno**
   - Archivo `.env.local` creado (requiere completar con tus keys)
   - Variables necesarias definidas

4. **Sistema de tipos TypeScript**
   - `/lib/types.ts` - Tipos completos (Message, Session, Profile, etc.)
   - `/lib/prompts.ts` - System prompts por modo de estudio
   - `/lib/limits.ts` - Lógica de límites de consultas

5. **Clientes de Supabase**
   - `/lib/supabase/client.ts` - Cliente para browser
   - `/lib/supabase/server.ts` - Cliente para server-side

6. **API Route de Chat con Streaming** ⭐
   - `/app/api/chat/stream/route.ts`
   - Streaming real con Anthropic SDK
   - Verificación de límites por plan
   - Soporte para usuarios anónimos
   - Edge runtime para performance

7. **Componentes de UI**
   - Button, Card (componentes base)
   - ChatBubble - Burbuja de chat con estilos TutorLaw
   - ChatInput - Input con auto-resize y submit con Enter
   - TypingIndicator - Animación de typing
   - ChatWindow - Ventana de chat completa

8. **Hook de Chat**
   - `/hooks/useChat.ts`
   - Maneja estado de mensajes
   - Streaming progresivo de respuestas
   - Soporte para AbortController
   - Manejo de errores

9. **Landing Page**
   - Hero section con chat embebido
   - Chat funcional sin login (5 mensajes gratis)
   - Identidad visual TutorLaw (navy/gold)
   - Responsive design

10. **Estilos globales**
    - Paleta de colores TutorLaw en CSS variables
    - Fuente DM Sans para UI
    - Georgia para títulos (serif)
    - Tailwind v4 inline theme

---

## 🔧 Para empezar a usar:

### 1. Configurar variables de entorno

Edita `.env.local` y completa:

```bash
ANTHROPIC_API_KEY=sk-ant-...  # Tu API key de Anthropic
NEXT_PUBLIC_SUPABASE_URL=https://...  # URL de tu proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # Anon key de Supabase
SUPABASE_SERVICE_ROLE_KEY=...  # Service role key
```

### 2. Iniciar servidor de desarrollo

```bash
cd ~/dev/tutorlaw
npm run dev
```

Abre http://localhost:3000

### 3. Probar el chat

La landing page tiene un chat funcional. Puedes hacer hasta 5 preguntas jurídicas sin registrarte.

---

## 📋 Próximos pasos - Fase 2: Auth

1. **Configurar Supabase Auth**
   - Crear proyecto en Supabase
   - Ejecutar schema SQL (ver CLAUDE.md)
   - Habilitar Google OAuth

2. **Crear páginas de auth**
   - `/login/page.tsx`
   - `/registro/page.tsx`

3. **Middleware de protección**
   - `/middleware.ts` - Proteger rutas `/app/*`

4. **Crear perfil al registrarse**
   - Trigger Supabase o función server-side

---

## 📁 Estructura de archivos creada

```
tutorlaw/
├── app/
│   ├── page.tsx                 ✅ Landing page
│   ├── layout.tsx               ✅ Layout global
│   ├── globals.css              ✅ Estilos TutorLaw
│   └── api/
│       └── chat/
│           └── stream/
│               └── route.ts     ✅ API streaming
├── components/
│   ├── ui/
│   │   ├── Button.tsx           ✅
│   │   └── Card.tsx             ✅
│   ├── chat/
│   │   ├── ChatWindow.tsx       ✅
│   │   ├── ChatBubble.tsx       ✅
│   │   ├── ChatInput.tsx        ✅
│   │   └── TypingIndicator.tsx  ✅
│   └── landing/
│       └── Hero.tsx             ✅
├── lib/
│   ├── types.ts                 ✅ Tipos TS
│   ├── prompts.ts               ✅ System prompts
│   ├── limits.ts                ✅ Lógica de límites
│   └── supabase/
│       ├── client.ts            ✅
│       └── server.ts            ✅
├── hooks/
│   └── useChat.ts               ✅ Hook de chat
└── .env.local                   ✅ Variables de entorno
```

---

## 🎨 Identidad visual implementada

- **NAVY_DARK:** `#0a1628` (fondo landing)
- **NAVY:** `#0d1f35` (sidebar)
- **NAVY_MID:** `#1e3a5f` (acentos)
- **GOLD:** `#c9a96e` (acento principal)
- **GOLD_LIGHT:** `#e8d5a3` (hover)
- **CREAM:** `#f9f7f3` (fondo app)

**Tipografía:**
- Títulos: `Georgia, serif`
- UI: `DM Sans, sans-serif`

---

## 🐛 Notas técnicas

- **Tailwind v4** usa configuración inline en `globals.css` (no `tailwind.config.js`)
- **@supabase/auth-helpers-nextjs** está deprecated → usamos `@supabase/ssr`
- **Edge runtime** en API route para mejor performance
- **Streaming** con `ReadableStream` web API

---

## 🚀 Testing rápido

Para verificar que todo funciona:

1. Asegúrate de tener ANTHROPIC_API_KEY configurada
2. `npm run dev`
3. Abre http://localhost:3000
4. Prueba escribir: "¿Qué es el derecho civil?"
5. Deberías ver la respuesta aparecer letra por letra (streaming)

---

**Estado:** Fase 1 completada ✅
**Siguiente:** Fase 2 - Auth
