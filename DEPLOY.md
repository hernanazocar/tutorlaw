# TutorLaw - Guía de Deploy

## ✅ Configuración completada

- **Repositorio GitHub:** https://github.com/hernanazocar/tutorlaw
- **Proyecto Vercel:** vinculado automáticamente

---

## 🔐 Variables de entorno en Vercel

Antes de hacer deploy, necesitas configurar estas variables en Vercel:

### Opción 1: Por CLI

```bash
cd ~/dev/tutorlaw

# Anthropic API Key
vercel env add ANTHROPIC_API_KEY

# Supabase (cuando lo configures)
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### Opción 2: Por Dashboard

1. Ve a https://vercel.com/hernan-azocar/tutorlaw/settings/environment-variables
2. Agrega cada variable:

**Variables requeridas para Fase 1:**
- `ANTHROPIC_API_KEY` - Tu API key de Anthropic (sk-ant-...)

**Variables para Fase 2 (cuando agregues Supabase):**
- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key

**Importante:** Marca todas las variables para los 3 ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🚀 Deploy

### Deploy a producción

```bash
cd ~/dev/tutorlaw
vercel --prod
```

### Deploy de preview (testing)

```bash
vercel
```

---

## 📝 Workflow de desarrollo

1. **Desarrollo local**
   ```bash
   npm run dev
   ```

2. **Commit cambios**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   git push
   ```

3. **Deploy automático**
   - Push a `main` → Deploy automático a producción
   - Push a otra branch → Deploy de preview

---

## 🌐 URLs

- **Repositorio:** https://github.com/hernanazocar/tutorlaw
- **Vercel Dashboard:** https://vercel.com/hernan-azocar/tutorlaw
- **Producción:** (se generará después del primer deploy)

---

## ⚠️ Antes del primer deploy

1. Asegúrate de tener `ANTHROPIC_API_KEY` configurada en Vercel
2. Verifica que el proyecto compile localmente: `npm run build`
3. Luego ejecuta: `vercel --prod`

---

## 🔧 Comandos útiles

```bash
# Ver variables de entorno
vercel env ls

# Descargar variables localmente
vercel env pull .env.local

# Ver logs de producción
vercel logs

# Ver deployments
vercel ls

# Abrir dashboard
vercel dashboard
```
