// sitio-publico/src/pages/Inicio.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TarjetaCurso from '../components/TarjetaCurso'
import FiltroSectores from '../components/FiltroSectores'

export default function Inicio() {
  const [cursos, setCursos] = useState([])
  const [sectores, setSectores] = useState([])
  const [slides, setSlides] = useState([])
  const [imagenHeader, setImagenHeader] = useState('')
  const [sectorActivo, setSectorActivo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [slideActual, setSlideActual] = useState(0)

  // Avanza el slide automáticamente cada 5 segundos
  useEffect(() => {
    if (slides.length <= 1) return
    const intervalo = setInterval(() => {
      setSlideActual(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(intervalo)
  }, [slides.length])

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const [resConfig, resBanners, resSectores, resCursos] = await Promise.all([
      supabase
        .from('configuracion')
        .select('valor')
        .eq('clave', 'imagen_header')
        .single(),
      supabase
        .from('banners')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true }),
      supabase
        .from('sectores')
        .select('*')
        .order('orden'),
      supabase
        .from('cursos')
        .select('*, sectores(nombre)')
        .eq('activo', true)
        .order('creado_en', { ascending: false }),
    ])

    if (resConfig.data?.valor) setImagenHeader(resConfig.data.valor)
    if (resBanners.data) setSlides(resBanners.data)
    if (resSectores.data) setSectores(resSectores.data)
    if (resCursos.data) setCursos(resCursos.data)
    setCargando(false)
  }

  const cursosFiltrados = sectorActivo
    ? cursos.filter(c => c.sector_id === sectorActivo)
    : cursos

  const nombreSectorActivo = sectorActivo
    ? sectores.find(s => s.id === sectorActivo)?.nombre
    : null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Encabezado ── */}
      {/* ── Encabezado ── */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        {imagenHeader && (
          <img
            src={imagenHeader}
            alt="Encabezado SENA CDATTG"
            style={{ width: '100%', display: 'block', maxHeight: '200px', objectFit: 'cover' }}
          />
        )}
      </header>

      {/* ── Banner slider con imágenes reales ── */}
      {slides.length > 0 && (
        <section style={{
          position: 'relative',
          height: '320px',
          overflow: 'hidden',
          background: '#1a5c00',
        }}>
          {/* Imagen de fondo */}
          <img
            src={slides[slideActual]?.imagen_url}
            alt={slides[slideActual]?.titulo ?? 'Banner'}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.5s',
            }}
          />

          {/* Overlay para legibilidad del texto */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 100%)',
          }} />

          {/* Texto sobre la imagen */}
          {(slides[slideActual]?.titulo || slides[slideActual]?.subtitulo) && (
            <div style={{ position: 'absolute', bottom: '40px', left: '32px' }}>
              {slides[slideActual]?.titulo && (
                <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>
                  {slides[slideActual].titulo}
                </h1>
              )}
              {slides[slideActual]?.subtitulo && (
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
                  {slides[slideActual].subtitulo}
                </p>
              )}
            </div>
          )}

          {/* Puntos de navegación */}
          <div style={{
            position: 'absolute', bottom: '14px', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: '8px',
          }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideActual(i)}
                style={{
                  width: i === slideActual ? '24px' : '8px',
                  height: '8px', borderRadius: '4px',
                  border: 'none', padding: 0, cursor: 'pointer',
                  background: i === slideActual ? 'white' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

          {/* Flechas — solo si hay más de un banner */}
          {slides.length > 1 && (
            <>
              <button
                onClick={() => setSlideActual(prev => (prev - 1 + slides.length) % slides.length)}
                style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white', borderRadius: '50%',
                  width: '36px', height: '36px', fontSize: '18px',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                ‹
              </button>
              <button
                onClick={() => setSlideActual(prev => (prev + 1) % slides.length)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white', borderRadius: '50%',
                  width: '36px', height: '36px', fontSize: '18px',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                ›
              </button>
            </>
          )}
        </section>
      )}

      {/* ── Filtros de sector ── */}
      <FiltroSectores
        sectores={sectores}
        sectorActivo={sectorActivo}
        onCambiar={setSectorActivo}
      />

      {/* ── Grilla de cursos ── */}
      <main style={{ flex: 1, padding: '20px 24px' }}>
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          marginBottom: '14px',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {nombreSectorActivo ?? 'Todos los sectores'} — {cursosFiltrados.length} programa{cursosFiltrados.length !== 1 ? 's' : ''}
        </p>

        {cargando ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '60px 0' }}>
            Cargando programas...
          </p>
        ) : cursosFiltrados.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '60px 0' }}>
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

      {/* ── Footer ── */}
      <footer style={{
        background: '#1a5c00',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>
            SENA · Servicio Nacional de Aprendizaje
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '2px' }}>
            Regional Guaviare 
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '2px' }}>
            Formación gratuita para Colombia
          </p>
        </div>
      </footer>

    </div>
  )
}