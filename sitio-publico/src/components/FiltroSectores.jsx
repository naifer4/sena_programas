// sitio-publico/src/components/FiltroSectores.jsx

export default function FiltroSectores({ sectores, sectorActivo, onCambiar }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      padding: '14px 24px',
      background: 'white',
      borderBottom: '1px solid var(--borde)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {/* Opción "Todos" siempre aparece primero */}
      <button
        onClick={() => onCambiar(null)}
        style={{
          padding: '5px 14px',
          borderRadius: '20px',
          border: '1px solid',
          fontSize: '13px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          borderColor: sectorActivo === null ? 'var(--verde)' : 'var(--borde)',
          background: sectorActivo === null ? 'var(--verde)' : 'white',
          color: sectorActivo === null ? 'white' : 'var(--texto-suave)',
          fontWeight: sectorActivo === null ? '500' : '400',
          transition: 'all 0.15s',
        }}
      >
        Todos
      </button>

      {sectores.map(sector => {
        const activo = sectorActivo === sector.id
        return (
          <button
            key={sector.id}
            onClick={() => onCambiar(sector.id)}
            style={{
              padding: '5px 14px',
              borderRadius: '20px',
              border: '1px solid',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              borderColor: activo ? 'var(--verde)' : 'var(--borde)',
              background: activo ? 'var(--verde)' : 'white',
              color: activo ? 'white' : 'var(--texto-suave)',
              fontWeight: activo ? '500' : '400',
              transition: 'all 0.15s',
            }}
          >
            {sector.nombre}
          </button>
        )
      })}
    </div>
  )
}