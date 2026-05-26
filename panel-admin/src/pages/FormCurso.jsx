// panel-admin/src/pages/FormCurso.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function FormCurso() {
  const { id } = useParams()           // si existe, estamos editando
  const esEdicion = Boolean(id)
  const navegar = useNavigate()

  const [sectores, setSectores] = useState([])
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  // Campos del formulario
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [sectorId, setSectorId] = useState('')
  const [competencias, setCompetencias] = useState('')   // string separado por comas
  const [urlMasInfo, setUrlMasInfo] = useState('')
  const [activo, setActivo] = useState(true)

  useEffect(() => {
    cargarSectores()
    if (esEdicion) cargarCurso()
  }, [])

  async function cargarSectores() {
    const { data } = await supabase.from('sectores').select('*').order('orden')
    if (data) setSectores(data)
  }

  async function cargarCurso() {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      setError('No se encontró el curso.')
    } else {
      setNombre(data.nombre)
      setDescripcion(data.descripcion ?? '')
      setSectorId(data.sector_id ?? '')
      // competencias es un array en la BD, lo convertimos a texto para el input
      setCompetencias((data.competencias ?? []).join(', '))
      setUrlMasInfo(data.url_mas_info ?? '')
      setActivo(data.activo)
    }
    setCargando(false)
  }

  async function manejarGuardar(e) {
    e.preventDefault()
    setGuardando(true)
    setError('')

    // Convierte el texto de competencias a arreglo limpio
    const arregloCompetencias = competencias
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)

    const datos = {
      nombre,
      descripcion,
      sector_id: sectorId || null,
      competencias: arregloCompetencias,
      url_mas_info: urlMasInfo || null,
      activo,
    }

    let errorGuardado

    if (esEdicion) {
      const { error } = await supabase.from('cursos').update(datos).eq('id', id)
      errorGuardado = error
    } else {
      const { error } = await supabase.from('cursos').insert(datos)
      errorGuardado = error
    }

    if (errorGuardado) {
      setError('No se pudo guardar el curso. Intenta de nuevo.')
    } else {
      navegar('/')    // vuelve al dashboard
    }

    setGuardando(false)
  }

  if (cargando) return (
    <p style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Cargando...</p>
  )

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>

      {/* Encabezado */}
      <div style={{ marginBottom: '24px' }}>
        <button
          className="btn btn-gris"
          style={{ marginBottom: '16px', fontSize: '13px', padding: '6px 12px' }}
          onClick={() => navegar('/')}
        >
          ← Volver
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '600' }}>
          {esEdicion ? 'Editar curso' : 'Nuevo curso'}
        </h1>
      </div>

      <div className="tarjeta">
        <form onSubmit={manejarGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div className="campo">
            <label>Nombre del programa *</label>
            <input
              type="text"
              placeholder="Técnico en Programación de Software"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>Sector</label>
            <select value={sectorId} onChange={e => setSectorId(e.target.value)}>
              <option value="">Selecciona un sector</option>
              {sectores.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label>Descripción</label>
            <textarea
              placeholder="Describe brevemente en qué consiste el programa..."
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Competencias</label>
            <input
              type="text"
              placeholder="Fundamentos de programación, Desarrollo web, Bases de datos"
              value={competencias}
              onChange={e => setCompetencias(e.target.value)}
            />
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              Separa cada competencia con una coma
            </p>
          </div>

          <div className="campo">
            <label>URL de más información</label>
            <input
              type="url"
              placeholder="https://..."
              value={urlMasInfo}
              onChange={e => setUrlMasInfo(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="activo"
              checked={activo}
              onChange={e => setActivo(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="activo" style={{ fontSize: '14px', cursor: 'pointer' }}>
              Curso visible en el sitio público
            </label>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button
              type="button"
              className="btn btn-gris"
              onClick={() => navegar('/')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-verde"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear curso'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}