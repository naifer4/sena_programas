// panel-admin/src/pages/Configuracion.jsx
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Configuracion() {
    const navegar = useNavigate()
  const [imagenActual, setImagenActual] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [previsualizacion, setPrevisualizacion] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const inputArchivo = useRef(null)

  useEffect(() => {
    cargarConfiguracion()
  }, [])

  async function cargarConfiguracion() {
    const { data } = await supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', 'imagen_header')
      .single()
    if (data?.valor) setImagenActual(data.valor)
  }

  function manejarArchivo(e) {
    const file = e.target.files[0]
    if (!file) return
    setArchivo(file)
    setPrevisualizacion(URL.createObjectURL(file))
  }

  async function guardarImagen(e) {
    e.preventDefault()
    if (!archivo) { setError('Selecciona una imagen.'); return }
    setSubiendo(true)
    setError('')
    setExito('')

    // Siempre usa el mismo nombre para sobrescribir la imagen anterior
    const extension = archivo.name.split('.').pop()
    const nombreArchivo = `header.${extension}`

    const { error: errorStorage } = await supabase.storage
      .from('configuracion')
      .upload(nombreArchivo, archivo, { upsert: true })

    if (errorStorage) {
      setError('No se pudo subir la imagen.')
      setSubiendo(false)
      return
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('configuracion')
      .getPublicUrl(nombreArchivo)

    // Agregar timestamp para forzar recarga en el navegador
    const urlFinal = `${urlData.publicUrl}?t=${Date.now()}`

    // Actualizar en la tabla
    const { error: errorBD } = await supabase
      .from('configuracion')
      .update({ valor: urlFinal })
      .eq('clave', 'imagen_header')

    if (errorBD) {
      setError('La imagen se subió pero no se pudo guardar.')
    } else {
      setImagenActual(urlFinal)
      setExito('Imagen del encabezado actualizada correctamente.')
      setArchivo(null)
      setPrevisualizacion(null)
      if (inputArchivo.current) inputArchivo.current.value = ''
    }

    setSubiendo(false)
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px' }}>
      <button
        className="btn btn-gris"
        style={{ marginBottom: '16px', fontSize: '13px', padding: '6px 12px' }}
        onClick={() => navegar('/')}
      >
        ← Volver al panel
      </button>
      <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '6px' }}>
        Configuración del sitio
      </h1>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
        Aquí puedes cambiar la imagen principal del encabezado.
      </p>

      {/* Imagen actual */}
      {imagenActual && (
        <div className="tarjeta" style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '10px' }}>
            Imagen actual
          </p>
          <img
            src={imagenActual}
            alt="Header actual"
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', maxHeight: '160px' }}
          />
        </div>
      )}

      {/* Formulario */}
      <div className="tarjeta">
        <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>
          Cambiar imagen del encabezado
        </h2>
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '14px' }}>
          Recomendado: imagen ancha, mínimo 1200 × 300 px. JPG, PNG o WEBP.
        </p>

        <form onSubmit={guardarImagen} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Zona de carga */}
          <div
            onClick={() => inputArchivo.current?.click()}
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f9f9f9',
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
                style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '6px', objectFit: 'cover' }}
              />
            ) : (
              <>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                  Haz clic para seleccionar una imagen
                </p>
                <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                  JPG, PNG o WEBP
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

          {error && <p className="error-msg">{error}</p>}
          {exito && (
            <p style={{
              background: '#f0fdf4', border: '1px solid #86efac',
              color: '#166534', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px',
            }}>
              {exito}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-verde" disabled={subiendo}>
              {subiendo ? 'Guardando...' : 'Guardar imagen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}