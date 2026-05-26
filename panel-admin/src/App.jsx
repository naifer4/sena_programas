// panel-admin/src/App.jsx
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FormCurso from './pages/FormCurso'
import RutaProtegida from './components/RutaProtegida'

export default function App() {
  // sesion: null = cargando, false = sin sesión, objeto = con sesión
  const [sesion, setSesion] = useState(null)

  useEffect(() => {
    // Verifica si ya hay sesión activa al cargar
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session ?? false)
    })

    // Escucha cambios (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, sesionActual) => {
      setSesion(sesionActual ?? false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Mientras verifica la sesión, no renderiza nada
  if (sesion === null) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={sesion ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={
            <RutaProtegida sesion={sesion}>
              <Dashboard />
            </RutaProtegida>
          }
        />
        <Route
          path="/curso/nuevo"
          element={
            <RutaProtegida sesion={sesion}>
              <FormCurso />
            </RutaProtegida>
          }
        />
        <Route
          path="/curso/editar/:id"
          element={
            <RutaProtegida sesion={sesion}>
              <FormCurso />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}