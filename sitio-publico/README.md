# Oferta AMT — Sitio público

Portal público del SENA Regional Guaviare para consultar la oferta de programas de formación técnica. Permite a aspirantes filtrar por sector, ver detalles de cada curso y reproducir videos promocionales.

🔗 **Producción:** https://amtoferta.vercel.app

## Stack

- **React 19** + **Vite** (frontend SPA)
- **Supabase** (Postgres + REST API) — solo lectura desde aquí
- **Vercel** (hosting + CI/CD)

## Estructura

```
src/
├── lib/
│   └── api.js              ← Cliente fetch para Supabase REST
├── components/
│   ├── TarjetaCurso.jsx
│   └── FiltroSectores.jsx
├── pages/
│   └── Inicio.jsx          ← Única página de la app
├── index.css               ← Estilos globales y tokens de diseño
└── main.jsx                ← Entry point
```

## Levantar en local

**Requisitos:** Node.js 20+ y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de variables de entorno
cp .env.example .env.local
# Después edítalo con los valores reales (ver más abajo)

# 3. Arrancar servidor de desarrollo
npm run dev
```

Abre `http://localhost:5173`.

## Variables de entorno

Crea un archivo `.env.local` (NO se commitea, está en `.gitignore`):

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...   # anon/public key del dashboard de Supabase
```

> ⚠️ Solo se usa la **anon key**. La service-role key NUNCA debe ir aquí — el bundle es público.

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compila a `dist/` para producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Análisis estático con ESLint |

## Datos de Supabase usados

Esta app lee (no escribe) de las siguientes tablas. Todas deben tener policy de **SELECT pública** en Supabase RLS:

- `configuracion` — clave/valor para imagen del header
- `banners` — slider principal
- `sectores` — categorías de los cursos
- `cursos` — programas de formación (con join a `sectores`)

## Despliegue

Push a `main` → Vercel hace deploy automático.
Las variables de entorno se configuran en el dashboard de Vercel (Settings → Environment Variables).