# TutorLaw - Design System

## 🎨 Paleta de Colores - Modern Minimal

### Colores Principales

```css
/* Blancos y Grises */
--white:     #ffffff  /* Fondos principales */
--gray-50:   #f8f9fa  /* Fondos secundarios, chat background */
--gray-100:  #f1f3f5  /* Fondos terciarios */
--gray-200:  #e9ecef  /* Bordes principales */
--gray-300:  #dee2e6  /* Bordes secundarios */
--gray-400:  #ced4da  /* Separadores */
--gray-500:  #adb5bd  /* Placeholder text */
--gray-600:  #6c757d  /* Texto secundario */
--gray-700:  #495057  /* Texto terciario */
--gray-800:  #343a40  /* Texto importante */
--gray-900:  #212529  /* Texto principal */

/* Azules */
--blue:       #0066ff  /* Color primario - botones, acentos */
--blue-hover: #0052cc  /* Hover de botones */
--blue-light: #e6f0ff  /* Fondos de badges, highlights */
--blue-dark:  #0047b3  /* Active states */
```

---

## 📝 Tipografía

### Fuente Principal
**Inter** - Moderna, limpia, excelente legibilidad

```typescript
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
```

### Escalas de Tamaño

```css
/* Títulos */
h1: 3.5rem - 4.5rem (56px - 72px) font-bold tracking-tight
h2: 2.5rem - 3rem (40px - 48px) font-bold
h3: 1.5rem - 2rem (24px - 32px) font-semibold

/* Cuerpo */
Base: 15px (0.9375rem) font-normal
Large: 1.25rem (20px) font-normal
Small: 0.875rem (14px) font-normal
Tiny: 0.75rem (12px) font-medium
```

---

## 🧩 Componentes

### Button

**Variantes:**
- **Primary:** Fondo azul, texto blanco, sombra sutil
- **Secondary:** Fondo blanco, borde gris, hover gris claro
- **Ghost:** Transparente, texto azul, hover fondo azul claro

**Tamaños:**
- **sm:** px-4 py-2 text-sm
- **md:** px-6 py-2.5 text-base
- **lg:** px-8 py-3.5 text-lg

**Bordes:** rounded-xl (12px)

### Card

- Fondo: white
- Borde: 1px solid #e9ecef
- Border radius: 1rem (16px) - 1.5rem (24px)
- Sombra: shadow-sm hover:shadow-md
- Transición: transition-shadow

### ChatBubble

**Usuario:**
- Fondo: #0066ff (azul primario)
- Texto: white
- Sombra: shadow-sm
- Alineación: derecha

**Asistente:**
- Fondo: white
- Borde: 1px solid #e9ecef
- Texto: #212529
- Sombra: shadow-sm
- Alineación: izquierda
- Logo: Escudo azul gradient con checkmark

**Espaciado:**
- Padding: px-5 py-3.5
- Max width: 85%
- Border radius: rounded-2xl (16px)

### ChatInput

- Fondo: #f8f9fa (gris claro)
- Borde: 1px solid #e9ecef
- Focus ring: 2px #0066ff
- Border radius: rounded-xl
- Botón enviar: Icono de flecha, azul primario

---

## 🎯 Logo

### Diseño
**Escudo con checkmark**
- Forma: Shield outline
- Checkmark: Dentro del escudo
- Gradiente: from-[#0066ff] to-[#0052cc]
- Stroke: white, 2px

### Tamaños
- **sm:** 32px (w-8 h-8)
- **md:** 40px (w-10 h-10)
- **lg:** 48px (w-12 h-12)

### Uso
```tsx
import { Logo } from '@/components/ui/Logo';

<Logo size="md" showText={true} />
```

---

## 📐 Espaciado

### Sistema de Grid
```css
/* Contenedores */
max-w-7xl mx-auto px-6 py-6

/* Secciones */
mb-16, mb-24 (espaciado entre secciones)

/* Componentes */
gap-3, gap-4, gap-6, gap-8, gap-12, gap-16
```

### Padding Interno
```css
/* Cards pequeñas */
px-4 py-3

/* Cards medianas */
px-5 py-4

/* Cards grandes */
px-6 py-5
```

---

## 🌊 Sombras

```css
/* Sutil */
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)

/* Estándar */
shadow: 0 1px 3px rgba(0,0,0,0.1)

/* Elevada */
shadow-md: 0 4px 6px rgba(0,0,0,0.07)

/* Destacada */
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)

/* Muy elevada */
shadow-2xl: 0 25px 50px rgba(0,0,0,0.15)
```

---

## 🎭 Animaciones

### Transiciones
```css
/* Estándar */
transition-all duration-200

/* Sombras */
transition-shadow

/* Colores */
transition-colors
```

### Hover States
- Botones: Cambio de color + sombra
- Cards: Elevación de sombra
- Links: Cambio de color

---

## 📱 Responsive

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First
```tsx
// Base: mobile
className="text-base"

// md: tablet y más
className="text-base md:text-lg"

// lg: desktop y más
className="text-base md:text-lg lg:text-xl"
```

---

## ✨ Principios de Diseño

1. **Minimalismo:** Menos es más - solo elementos esenciales
2. **Espaciado:** Generoso whitespace para respirar
3. **Jerarquía:** Clara diferenciación visual de elementos
4. **Consistencia:** Mismo estilo en toda la app
5. **Accesibilidad:** Contraste WCAG AA mínimo
6. **Performance:** Animaciones suaves, 60fps

---

## 🎨 Ejemplos de Uso

### Hero Section
```tsx
<div className="max-w-7xl mx-auto px-6 py-6">
  <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
    Título principal
  </h1>
  <p className="text-xl text-gray-600 mt-6">
    Descripción secundaria
  </p>
</div>
```

### Badge
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-light text-blue rounded-full text-sm font-medium">
  <svg>...</svg>
  Badge text
</div>
```

### Feature Card
```tsx
<div className="flex items-start gap-3">
  <div className="w-6 h-6 rounded-lg bg-blue-light flex items-center justify-center">
    <svg className="w-4 h-4 text-blue">...</svg>
  </div>
  <div>
    <div className="font-semibold text-gray-900">Título</div>
    <div className="text-xs text-gray-600 mt-0.5">Descripción</div>
  </div>
</div>
```

---

**Última actualización:** Fase 1 - Diseño minimalista moderno
