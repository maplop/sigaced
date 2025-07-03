import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoute = () => {

  return true ? <Outlet /> : <Navigate to="/auth" replace />
}
