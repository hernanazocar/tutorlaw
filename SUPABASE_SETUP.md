# TutorLaw - Configuración de Supabase

## 📋 Checklist de Setup

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Clic en "New Project"
4. Configuración:
   - **Name:** TutorLaw
   - **Database Password:** (guárdalo en lugar seguro)
   - **Region:** South America (São Paulo) - más cercano a Chile
   - **Pricing Plan:** Free (suficiente para empezar)
5. Espera 2-3 minutos mientras se crea el proyecto

---

### 2. Configurar Base de Datos

1. En el Dashboard de Supabase, ve a **SQL Editor**
2. Clic en "New Query"
3. Copia TODO el contenido de `supabase/schema.sql`
4. Pega en el editor
5. Clic en **Run** (abajo a la derecha)
6. Verifica que dice "Success. No rows returned"

Esto creará:
- ✅ Tablas: `profiles`, `sessions`, `messages`, `progress`, `logros`
- ✅ Row Level Security policies
- ✅ Triggers automáticos
- ✅ Indexes para performance

---

### 3. Obtener Credenciales

En el Dashboard de Supabase:

1. Ve a **Settings** (⚙️ en el menú izquierdo)
2. Clic en **API**
3. Copia las siguientes credenciales:

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Anon (public) key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Service role key (NUNCA expongas esto en el cliente)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

### 4. Configurar Variables de Entorno

#### Local (.env.local)

Ya tienes el archivo `.env.local`, actualiza estas líneas:

```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...  # Ya configurada

# Supabase - ACTUALIZA ESTAS 👇
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Vercel (Producción)

```bash
cd ~/dev/tutorlaw

# Agregar variables a Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

**Importante:** Marca las 3 para Production, Preview y Development

O hazlo por el dashboard: https://vercel.com/hernan-azocar/tutorlaw/settings/environment-variables

---

### 5. Configurar Google OAuth (Opcional pero Recomendado)

1. **Crear app en Google Console:**
   - Ve a [https://console.cloud.google.com](https://console.cloud.google.com)
   - Crea nuevo proyecto "TutorLaw"
   - Habilita "Google+ API"
   - Ve a "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: **TutorLaw**
   - Authorized redirect URIs:
     ```
     https://tu-proyecto.supabase.co/auth/v1/callback
     https://tutorlaw.vercel.app/auth/callback
     http://localhost:3000/auth/callback
     ```
   - Copia **Client ID** y **Client Secret**

2. **Configurar en Supabase:**
   - Dashboard Supabase → **Authentication** → **Providers**
   - Busca **Google**
   - Activa el toggle
   - Pega Client ID y Client Secret
   - Save

---

### 6. Configurar Email (Auth via Email)

En Supabase Dashboard:

1. Ve a **Authentication** → **Email Templates**
2. Personaliza los emails (opcional):
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

3. **Settings** → **Auth**:
   - ✅ Enable Email Confirmations (recomendado)
   - ✅ Enable Email Change Confirmations
   - Site URL: `https://tutorlaw.vercel.app`
   - Redirect URLs: 
     ```
     https://tutorlaw.vercel.app/**
     http://localhost:3000/**
     ```

---

### 7. Probar la Autenticación

#### Local:

```bash
cd ~/dev/tutorlaw
npm run dev
```

1. Abre http://localhost:3000/registro
2. Crea una cuenta con tu email
3. Revisa tu email para confirmar
4. Inicia sesión en http://localhost:3000/login
5. Deberías ser redirigido a `/app/chat` (aún no existe, mostrará 404 - esto es normal)

#### Verificar en Supabase:

- Dashboard → **Authentication** → **Users**
- Deberías ver tu usuario creado
- Dashboard → **Table Editor** → **profiles**
- Deberías ver tu perfil con plan "free"

---

## ✅ Checklist Final

- [ ] Proyecto Supabase creado
- [ ] Schema SQL ejecutado correctamente
- [ ] Variables de entorno configuradas localmente
- [ ] Variables de entorno configuradas en Vercel
- [ ] Google OAuth configurado (opcional)
- [ ] Email auth funcionando
- [ ] Probado registro local
- [ ] Probado login local
- [ ] Deploy en Vercel con nuevas variables

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste bien las keys de Supabase
- Las keys empiezan con `eyJ...`
- NO uses comillas en el `.env.local`

### Error: "relation 'profiles' does not exist"
- No se ejecutó el schema.sql correctamente
- Ve a SQL Editor en Supabase y ejecuta de nuevo

### Email de confirmación no llega
- Revisa spam
- Verifica que la dirección "From" de Supabase no esté bloqueada
- En desarrollo puedes deshabilitar email confirmation temporalmente

### Redirect loop en login
- Verifica que las redirect URLs estén configuradas
- Revisa que el middleware.ts esté funcionando
- Chequea que las variables de entorno estén en Vercel

### "User already registered"
- Usuario ya existe, intenta login
- O usa función "¿Olvidaste tu contraseña?"

---

## 📊 Monitoreo

Una vez funcionando, puedes monitorear:

- **Users:** Dashboard → Authentication → Users
- **Database:** Dashboard → Table Editor
- **Logs:** Dashboard → Logs
- **API Usage:** Dashboard → Settings → Usage

---

## 🚀 Siguiente Paso

Una vez configurado Supabase, el siguiente paso es:

**Crear el Dashboard /app/chat** donde los usuarios podrán:
- Ver su historial de sesiones
- Usar los 7 modos de estudio
- Ver su progreso
- Generar flashcards
- Exportar guías

---

**¿Listo para configurar Supabase? Sigue este checklist paso a paso.**
