/* eslint-disable prettier/prettier */
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './components/Auth/Auth'
import MainLayout from './layouts/MainLayout'
import Statistics from './pages/Statistics'
import Applicants from './pages/Applicants'
import Careers from './pages/Careers'
import Location from './pages/Location'
import Places from './pages/Places'
import { ROUTES } from './routes/routes'
import { Toaster } from './components/ui/sonner'

function App(): React.JSX.Element {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.LOGIN} element={<Auth />} />
        <Route path={ROUTES.REGISTER} element={<Auth />} />
        <Route element={<MainLayout />}>
          <Route index path={ROUTES.STATISTICS} element={<Statistics />} />
          <Route path={ROUTES.APPLICANTS} element={<Applicants />} />
          <Route path={ROUTES.CAREERS} element={<Careers />} />
          <Route path={ROUTES.PLACES} element={<Places />} />
          <Route path={ROUTES.LOCATION} element={<Location />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  )
}

export default App
