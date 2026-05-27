// panel-admin/src/pages/Login.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function manejarLogin(e) {
    e.preventDefault()
    setCargando(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: clave,
    })

    if (error) {
      setError('Correo o contraseña incorrectos.')
    }
    // Si no hay error, App.jsx detecta el cambio de sesión y redirige al Dashboard
    setCargando(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="tarjeta" style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo SENA */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <img
            src="/logo-sena.png"
            alt="Logo SENA"
            style={{ width: '72px', margin: '0 auto 12px', display: 'block' }}
          />
          <h1 style={{ fontSize: '18px', fontWeight: '600' }}>Panel de administración</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            Ingresa con tu cuenta institucional
          </p>
        </div>

        <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="campo">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="director@sena.edu.co"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={clave}
              onChange={e => setClave(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            type="submit"
            className="btn btn-verde"
            style={{ justifyContent: 'center', padding: '10px' }}
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}