# TutorLaw 📚⚖️

Plataforma de tutoría jurídica con inteligencia artificial para estudiantes universitarios de derecho en Chile y Latinoamérica.

**Tu profesor de derecho disponible 24/7**

---

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **IA:** Anthropic Claude Sonnet 4
- **Auth:** Supabase Auth
- **Base de datos:** Supabase Postgres
- **Deploy:** Vercel

---

## 📋 Estado Actual

### ✅ Fase 1 - Base (Completada)

- Chat con streaming en tiempo real
- Landing page funcional
- API route con Claude Sonnet 4
- Sistema de componentes UI
- Hook `useChat` reutilizable
- Identidad visual TutorLaw

### 🔄 Próximas Fases

- **Fase 2:** Autenticación (Supabase Auth, login, registro)
- **Fase 3:** Dashboard y modos de estudio
- **Fase 4:** Features avanzadas (voz, PDF upload, export)

---

## 🛠️ Desarrollo Local

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta en Anthropic (para API key)
- Cuenta en Supabase (opcional para Fase 2)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/hernanazocar/tutorlaw.git
cd tutorlaw

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local y agrega tu ANTHROPIC_API_KEY

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

---

## 🌐 Deploy

**Repositorio:** https://github.com/hernanazocar/tutorlaw

**Vercel:** Configurado con deploy automático desde `main`

Ver [DEPLOY.md](./DEPLOY.md) para instrucciones completas.

---

## 🎨 Identidad Visual

### Paleta de Colores

```
NAVY_DARK:  #0a1628   (fondo landing)
NAVY:       #0d1f35   (sidebar)
NAVY_MID:   #1e3a5f   (acentos)
GOLD:       #c9a96e   (acento principal)
GOLD_LIGHT: #e8d5a3   (hover)
CREAM:      #f9f7f3   (fondo app)
```

### Tipografía

- **Títulos:** Georgia (serif)
- **UI/Cuerpo:** DM Sans (sans-serif)

---

## 🧠 Modos de Estudio

TutorLaw ofrece 7 modos especializados:

1. **📖 Tutor** - Explicaciones estructuradas paso a paso
2. **🔍 Socrático** - Aprendizaje mediante preguntas guiadas
3. **⚖️ Caso IRAC** - Resolución de casos con metodología IRAC
4. **🗣️ Debate** - Argumentación y contraargumentación
5. **📝 Preguntas** - Generación y evaluación de exámenes
6. **🎤 Examen oral** - Simulación de examen oral con profesor
7. **✏️ Ensayo** - Evaluación de ensayos con rúbrica

---

## 📁 Estructura del Proyecto

```
tutorlaw/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── chat/stream/   # Streaming de Claude
│   ├── layout.tsx         # Layout global
│   └── page.tsx           # Landing page
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── chat/             # Chat components
│   └── landing/          # Landing components
├── lib/                  # Utilidades y lógica
│   ├── types.ts          # Tipos TypeScript
│   ├── prompts.ts        # System prompts
│   ├── limits.ts         # Lógica de límites
│   └── supabase/         # Clientes de Supabase
├── hooks/                # Custom React hooks
│   └── useChat.ts        # Hook principal de chat
└── public/               # Assets estáticos
```

---

## 🔐 Variables de Entorno

```bash
# .env.local
ANTHROPIC_API_KEY=           # Required
NEXT_PUBLIC_SUPABASE_URL=    # Fase 2
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Fase 2
SUPABASE_SERVICE_ROLE_KEY=   # Fase 2
```

---

## 📚 Documentación

- [DESARROLLO.md](./DESARROLLO.md) - Estado detallado del desarrollo
- [DEPLOY.md](./DEPLOY.md) - Guía de deploy en Vercel
- [CLAUDE.md](./CLAUDE.md) - Prompt maestro para desarrollo

---

## 🤝 Contribuir

Este es un proyecto privado en desarrollo. Para contribuir, contacta al equipo.

---

## 📄 Licencia

Propiedad de TutorLaw - Todos los derechos reservados

---

## 📞 Contacto

- **Website:** tutorlaw.cl (próximamente)
- **GitHub:** https://github.com/hernanazocar/tutorlaw

---

**Construido con ❤️ para estudiantes de derecho**
