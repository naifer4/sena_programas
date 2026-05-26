// panel-admin/src/components/RutaProtegida.jsx
import { Navigate } from 'react-router-dom'

export default function RutaProtegida({ sesion, children }) {
  if (!sesion) return <Navigate to="/login" replace />
  return children
}