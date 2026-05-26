// sitio-publico/src/components/TarjetaCurso.jsx

export default function TarjetaCurso({ curso }) {
  return (
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
      {/* Barra verde superior */}
      <div style={{ height: '4px', background: 'var(--verde)' }} />

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Sector */}
        <span style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: '500',
          padding: '2px 10px',
          borderRadius: '10px',
          background: 'var(--verde-claro)',
          color: 'var(--verde-oscuro)',
          alignSelf: 'flex-start',
        }}>
          {curso.sectores?.nombre ?? 'General'}
        </span>

        {/* Nombre */}
        <h2 style={{ fontSize: '14px', fontWeight: '600', lineHeight: '1.35' }}>
          {curso.nombre}
        </h2>

        {/* Descripción */}
        {curso.descripcion && (
          <p style={{
            fontSize: '13px',
            color: 'var(--texto-suave)',
            lineHeight: '1.5',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {curso.descripcion}
          </p>
        )}

        {/* Competencias */}
        {curso.competencias?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {curso.competencias.map((comp, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{
                  width: '5px', height: '5px',
                  borderRadius: '50%',
                  background: 'var(--verde)',
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: '12px', color: 'var(--texto-suave)' }}>{comp}</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Footer con botón */}
      {curso.url_mas_info && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--borde)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          
            <a href={curso.url_mas_info} target="_blank" rel="noreferrer" className="btn-verde">
              Más información
            </a>
        </div>
      )}
    </div>
  )
}