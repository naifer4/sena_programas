console.log('🔍 VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('🔍 VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 30) + '...')

const URL_BASE = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`

const HEADERS = {
  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
}

/**
 * Hace un GET a una tabla de Supabase y devuelve un array de filas.
 * @param {string} ruta — sintaxis PostgREST, ej: 'cursos?select=*&activo=eq.true'
 * @returns {Promise<Array>}
 */
export async function leer(ruta) {
  const respuesta = await fetch(`${URL_BASE}/${ruta}`, { headers: HEADERS })

  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    throw new Error(`Supabase ${respuesta.status}: ${detalle}`)
  }

  return respuesta.json()
}


export async function leerUno(ruta) {
  const filas = await leer(ruta)
  return filas[0] ?? null
}