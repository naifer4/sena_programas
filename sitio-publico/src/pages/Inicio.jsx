// sitio-publico/src/pages/Inicio.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TarjetaCurso from '../components/TarjetaCurso'
import FiltroSectores from '../components/FiltroSectores'

export default function Inicio() {
  const [cursos, setCursos] = useState([])
  const [sectores, setSectores] = useState([])
  const [sectorActivo, setSectorActivo] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    // Carga sectores y cursos activos en paralelo
    const [resSectores, resCursos] = await Promise.all([
      supabase.from('sectores').select('*').order('orden'),
      supabase
        .from('cursos')
        .select('*, sectores(nombre)')
        .eq('activo', true)              // solo cursos visibles
        .order('creado_en', { ascending: false }),
    ])

    if (resSectores.data) setSectores(resSectores.data)
    if (resCursos.data) setCursos(resCursos.data)
    setCargando(false)
  }

  // Filtra según el sector seleccionado
  const cursosFiltrados = sectorActivo
    ? cursos.filter(c => c.sector_id === sectorActivo)
    : cursos

  const nombreSectorActivo = sectorActivo
    ? sectores.find(s => s.id === sectorActivo)?.nombre
    : null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Encabezado */}
      <header style={{ background: '#39A900', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px', height: '40px',
          background: 'white',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: '700', color: '#39A900',
          flexShrink: 0,
        }}>
          SENA
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>
            Programas de Formación Técnica
          </p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
            Regional Guaviare · Articulación con la Media
          </p>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: 'var(--verde-claro)',
        padding: '28px 24px 20px',
        borderBottom: '1px solid var(--verde-medio)',
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--verde-oscuro)', lineHeight: '1.3' }}>
          Formación gratuita y de calidad<br />para tu región
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--texto-suave)', marginTop: '6px', maxWidth: '520px' }}>
          Programas técnicos que se articulan con tecnológicos y carreras universitarias.
          Atrévete a formarte con el SENA.
        </p>
      </section>

      {/* Filtros */}
      <FiltroSectores
        sectores={sectores}
        sectorActivo={sectorActivo}
        onCambiar={setSectorActivo}
      />

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: '20px 24px' }}>

        {/* Etiqueta de sección */}
        <p style={{ fontSize: '12px', color: 'var(--texto-suave)', marginBottom: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {nombreSectorActivo ?? 'Todos los sectores'} — {cursosFiltrados.length} programa{cursosFiltrados.length !== 1 ? 's' : ''}
        </p>

        {cargando ? (
          <p style={{ color: 'var(--texto-suave)', textAlign: 'center', padding: '60px 0' }}>
            Cargando programas...
          </p>
        ) : cursosFiltrados.length === 0 ? (
          <p style={{ color: 'var(--texto-suave)', textAlign: 'center', padding: '60px 0' }}>
            No hay programas en este sector.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '14px',
          }}>
            {cursosFiltrados.map(curso => (
              <TarjetaCurso key={curso.id} curso={curso} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--verde-oscuro)',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        padding: '16px',
        fontSize: '12px',
      }}>
        <strong style={{ color: 'white' }}>SENA</strong> · Servicio Nacional de Aprendizaje · Formación gratuita para Colombia
      </footer>

    </div>
  )
}