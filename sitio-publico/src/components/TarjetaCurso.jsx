// sitio-publico/src/components/TarjetaCurso.jsx
import { useState } from 'react'

function obtenerUrlEmbed(url) {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    let videoId = null
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v')
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1)
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  } catch {
    return null
  }
}

export default function TarjetaCurso({ curso }) {
  const [expandido, setExpandido] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const urlEmbed = obtenerUrlEmbed(curso.video_url)

  return (
    <div style={{ position: 'relative' }}>

      <div
        style={{
          background: 'white',
          border: '1px solid var(--borde)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--verde)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--borde)'}
      >
        <div style={{ height: '4px', background: 'var(--verde)' }} />

        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

          <span style={{
            display: 'inline-block',
            fontSize: '11px', fontWeight: '500',
            padding: '2px 10px', borderRadius: '10px',
            background: 'var(--verde-claro)', color: 'var(--verde-oscuro)',
            alignSelf: 'flex-start',
          }}>
            {curso.sectores?.nombre ?? 'General'}
          </span>

          <h2 style={{ fontSize: '15px', fontWeight: '700', lineHeight: '1.35', color: '#5b2d8e' }}>
            {curso.nombre}
          </h2>

          {curso.descripcion && (
            <p style={{ fontSize: '13px', color: 'var(--texto-suave)', lineHeight: '1.5' }}>
              {curso.descripcion}
            </p>
          )}

          {expandido && (
            <div style={{
              background: 'var(--verde-claro)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {curso.competencias?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {curso.competencias.map((comp, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: 'var(--verde)', flexShrink: 0, marginTop: '5px',
                      }} />
                      <span style={{ fontSize: '13px', color: '#374151', lineHeight: '1.4' }}>
                        {comp}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {urlEmbed && (
                <button
                  onClick={() => setModalAbierto(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#dc2626', color: 'white',
                    border: 'none', borderRadius: '8px',
                    padding: '8px 14px', fontSize: '13px', fontWeight: '500',
                    cursor: 'pointer', marginTop: '4px', alignSelf: 'flex-start',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ver video del programa
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => setExpandido(!expandido)}
            style={{
              background: expandido ? 'var(--verde-medio)' : 'var(--verde)',
              color: expandido ? 'var(--verde-oscuro)' : 'white',
              border: 'none', borderRadius: '8px',
              padding: '8px 14px', fontSize: '13px', fontWeight: '500',
              cursor: 'pointer', alignSelf: 'flex-start',
              transition: 'all 0.15s',
            }}
          >
            {expandido ? 'Ver menos' : 'Ver más'}
          </button>
        </div>

        {curso.url_mas_info && (
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--borde)',
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <a href={curso.url_mas_info} target="_blank" rel="noreferrer" className="btn-verde">
              Más información
            </a>
          </div>
        )}
      </div>

      {modalAbierto && urlEmbed && (
        <div
          onClick={() => setModalAbierto(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '720px',
            }}
          >
            <div style={{
              padding: '14px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid var(--borde)',
            }}>
              <p style={{ fontWeight: '600', fontSize: '14px', color: '#5b2d8e' }}>
                {curso.nombre}
              </p>
              <button
                onClick={() => setModalAbierto(false)}
                style={{
                  background: 'none', border: 'none',
                  fontSize: '22px', cursor: 'pointer',
                  color: '#6b7280', lineHeight: 1, padding: '0 4px',
                }}
              >
                x
              </button>
            </div>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe src={urlEmbed} title={curso.nombre} allowFullScreen={true} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}