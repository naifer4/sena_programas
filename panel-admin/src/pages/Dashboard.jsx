// panel-admin/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [cursos, setCursos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const navegar = useNavigate()

  useEffect(() => {
    cargarCursos()
  }, [])

  async function cargarCursos() {
    setCargando(true)
    const { data, error } = await supabase
      .from('cursos')
      .select('*, sectores(nombre)')   // trae también el nombre del sector
      .order('creado_en', { ascending: false })

    if (error) setError('No se pudieron cargar los cursos.')
    else setCursos(data)
    setCargando(false)
  }

  async function toggleActivo(curso) {
    const { error } = await supabase
      .from('cursos')
      .update({ activo: !curso.activo })
      .eq('id', curso.id)

    if (!error) {
      // Actualiza el estado local sin recargar todo
      setCursos(prev =>
        prev.map(c => c.id === curso.id ? { ...c, activo: !c.activo } : c)
      )
    }
  }

  async function eliminarCurso(id) {
    const confirmar = window.confirm('¿Seguro que quieres eliminar este curso? Esta acción no se puede deshacer.')
    if (!confirmar) return

    const { error } = await supabase.from('cursos').delete().eq('id', id)
    if (!error) setCursos(prev => prev.filter(c => c.id !== id))
    else setError('No se pudo eliminar el curso.')
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px' }}>

      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Programas de formación</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
            {cursos.length} curso{cursos.length !== 1 ? 's' : ''} registrado{cursos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-verde" onClick={() => navegar('/curso/nuevo')}>
            + Nuevo curso
          </button>
          <button className="btn btn-gris" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {error && <p className="error-msg" style={{ marginBottom: '16px' }}>{error}</p>}

      {/* Lista */}
      {cargando ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>Cargando cursos...</p>
      ) : cursos.length === 0 ? (
        <div className="tarjeta" style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          <p style={{ marginBottom: '12px' }}>No hay cursos registrados aún.</p>
          <button className="btn btn-verde" onClick={() => navegar('/curso/nuevo')}>
            Crear el primero
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {cursos.map(curso => (
            <div key={curso.id} className="tarjeta" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>

              {/* Indicador activo/inactivo */}
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                background: curso.activo ? '#39A900' : '#d1d5db',
              }} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '2px' }}>
                  {curso.nombre}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  {curso.sectores?.nombre ?? 'Sin sector'} · {curso.activo ? 'Visible' : 'Oculto'}
                </p>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  className="btn btn-gris"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={() => toggleActivo(curso)}
                >
                  {curso.activo ? 'Ocultar' : 'Mostrar'}
                </button>
                <button
                  className="btn btn-gris"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={() => navegar(`/curso/editar/${curso.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-rojo"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={() => eliminarCurso(curso.id)}
                >
                  Eliminar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}