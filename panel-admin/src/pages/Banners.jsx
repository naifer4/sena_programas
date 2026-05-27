// panel-admin/src/pages/Banners.jsx
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Banners() {
    const navegar = useNavigate()
  const [banners, setBanners] = useState([])
  const [cargando, setCargando] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  // Campos del formulario de nuevo banner
  const [titulo, setTitulo] = useState('')
  const [subtitulo, setSubtitulo] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [previsualizacion, setPrevisualizacion] = useState(null)
  const inputArchivo = useRef(null)

  useEffect(() => {
    cargarBanners()
  }, [])

  async function cargarBanners() {
    setCargando(true)
    const { data } = await supabase
      .from('banners')
      .select('*')
      .order('orden', { ascending: true })
    if (data) setBanners(data)
    setCargando(false)
  }

  // Muestra previsualización de la imagen seleccionada
  function manejarArchivo(e) {
    const file = e.target.files[0]
    if (!file) return
    setArchivo(file)
    setPrevisualizacion(URL.createObjectURL(file))
  }

  async function subirBanner(e) {
    e.preventDefault()
    if (!archivo) { setError('Selecciona una imagen.'); return }
    setSubiendo(true)
    setError('')
    setExito('')

    // 1. Subir imagen al bucket de Supabase Storage
    const extension = archivo.name.split('.').pop()
    const nombreArchivo = `banner-${Date.now()}.${extension}`

    const { error: errorStorage } = await supabase.storage
      .from('banners')
      .upload(nombreArchivo, archivo, { upsert: false })

    if (errorStorage) {
      setError('No se pudo subir la imagen. Intenta de nuevo.')
      setSubiendo(false)
      return
    }

    // 2. Obtener la URL pública de la imagen
    const { data: urlData } = supabase.storage
      .from('banners')
      .getPublicUrl(nombreArchivo)

    // 3. Guardar el banner en la tabla
    const { error: errorBD } = await supabase.from('banners').insert({
      titulo,
      subtitulo,
      imagen_url: urlData.publicUrl,
      orden: banners.length + 1,
      activo: true,
    })

    if (errorBD) {
      setError('La imagen se subió pero no se pudo guardar el banner.')
    } else {
      setExito('Banner agregado correctamente.')
      // Limpiar formulario
      setTitulo('')
      setSubtitulo('')
      setArchivo(null)
      setPrevisualizacion(null)
      if (inputArchivo.current) inputArchivo.current.value = ''
      cargarBanners()
    }

    setSubiendo(false)
  }

  async function toggleActivo(banner) {
    const { error } = await supabase
      .from('banners')
      .update({ activo: !banner.activo })
      .eq('id', banner.id)
    if (!error) {
      setBanners(prev =>
        prev.map(b => b.id === banner.id ? { ...b, activo: !b.activo } : b)
      )
    }
  }

  async function eliminarBanner(banner) {
    const confirmar = window.confirm('¿Eliminar este banner? No se puede deshacer.')
    if (!confirmar) return

    // Extraer el nombre del archivo de la URL
    const nombreArchivo = banner.imagen_url.split('/').pop()

    // Eliminar del storage
    await supabase.storage.from('banners').remove([nombreArchivo])

    // Eliminar de la tabla
    const { error } = await supabase.from('banners').delete().eq('id', banner.id)
    if (!error) setBanners(prev => prev.filter(b => b.id !== banner.id))
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px' }}>
    <button
        className="btn btn-gris"
        style={{ marginBottom: '16px', fontSize: '13px', padding: '6px 12px' }}
        onClick={() => navegar('/')}
      >
        ← Volver al panel
      </button>
      <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '6px' }}>
        Banners del sitio
      </h1>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
        Las imágenes aparecen en el slider principal de la página pública.
      </p>

      {/* ── Formulario nuevo banner ── */}
      <div className="tarjeta" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>
          Agregar nuevo banner
        </h2>

        <form onSubmit={subirBanner} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Zona de carga de imagen */}
          <div
            onClick={() => inputArchivo.current?.click()}
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: previsualizacion ? 'transparent' : '#f9f9f9',
              transition: 'border-color 0.15s',
              overflow: 'hidden',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#39A900'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#d1d5db'}
          >
            {previsualizacion ? (
              <img
                src={previsualizacion}
                alt="Previsualización"
                style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '6px', objectFit: 'cover' }}
              />
            ) : (
              <>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                  Haz clic para seleccionar una imagen
                </p>
                <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                  JPG, PNG o WEBP · Recomendado: 1200 × 400 px
                </p>
              </>
            )}
            <input
              ref={inputArchivo}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={manejarArchivo}
              style={{ display: 'none' }}
            />
          </div>

          <div className="campo">
            <label>Título (opcional)</label>
            <input
              type="text"
              placeholder="Articulación con la Media"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Subtítulo (opcional)</label>
            <input
              type="text"
              placeholder="Doblemente titulados"
              value={subtitulo}
              onChange={e => setSubtitulo(e.target.value)}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}
          {exito && (
            <p style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
              {exito}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-verde" disabled={subiendo}>
              {subiendo ? 'Subiendo...' : 'Agregar banner'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Lista de banners actuales ── */}
      <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>
        Banners actuales ({banners.length})
      </h2>

      {cargando ? (
        <p style={{ color: '#6b7280' }}>Cargando...</p>
      ) : banners.length === 0 ? (
        <div className="tarjeta" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
          No hay banners aún. Agrega el primero arriba.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {banners.map(banner => (
            <div key={banner.id} className="tarjeta" style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 16px' }}>

              {/* Miniatura */}
              <img
                src={banner.imagen_url}
                alt={banner.titulo ?? 'Banner'}
                style={{ width: '100px', height: '56px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '2px' }}>
                  {banner.titulo || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Sin título</span>}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  {banner.subtitulo || 'Sin subtítulo'} · {banner.activo ? 'Visible' : 'Oculto'}
                </p>
              </div>

              {/* Indicador */}
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                background: banner.activo ? '#39A900' : '#d1d5db',
              }} />

              {/* Acciones */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  className="btn btn-gris"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={() => toggleActivo(banner)}
                >
                  {banner.activo ? 'Ocultar' : 'Mostrar'}
                </button>
                <button
                  className="btn btn-rojo"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={() => eliminarBanner(banner)}
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