# Oferta AMT — Panel de administración

Backoffice para gestionar la oferta de programas de formación del SENA Regional Guaviare. Acceso restringido por autenticación.

## Stack

- **React 19** + **Vite**
- **React Router 7** (navegación entre páginas)
- **Supabase** — auth, base de datos y storage de imágenes
- **Vercel** (hosting)

## Funcionalidades

- Login con email/contraseña
- CRUD de cursos (crear, editar, activar/desactivar, eliminar)
- Gestión de banners del slider público (upload, orden, visibilidad)
- Cambio de la imagen del header del sitio público

## Levantar en local

```bash
npm install
cp .env.example .env.local   # edita los valores
npm run dev
```

## Variables de entorno

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
```

## Estructura

```
src/
├── lib/supabase.js              ← Cliente @supabase/supabase-js
├── components/RutaProtegida.jsx ← Guard de auth para rutas privadas
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── FormCurso.jsx            ← Crear y editar (misma vista)
│   ├── Banners.jsx
│   └── Configuracion.jsx
└── App.jsx                      ← Definición de rutas
```

## Permisos en Supabase

Las tablas requieren RLS activado con policies que permitan INSERT/UPDATE/DELETE solo a usuarios autenticados:

```sql
CREATE POLICY "auth users full access" ON cursos
  FOR ALL USING (auth.role() = 'authenticated');
```

(Repetir para `banners`, `sectores`, `configuracion`.)

## Crear un usuario admin

Desde el dashboard de Supabase → Authentication → Users → Add user → "Create new user".