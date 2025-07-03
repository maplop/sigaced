/* eslint-disable prettier/prettier */
import { Routes, Route } from 'react-router-dom'
import Auth from './components/Auth/Auth'
import MainLayout from './layouts/MainLayout'
import Statistics from './pages/Statistics'
import Applicants from './pages/Applicants'
import Careers from './pages/Careers'
import Location from './pages/Location'
import Places from './pages/Places'
import { ROUTES } from './routes/routes'


function App(): React.JSX.Element {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Routes>
        <Route index path={ROUTES.ROOT} element={<Auth />} />
        <Route element={<MainLayout />}>
          <Route index path={ROUTES.STATISTICS} element={<Statistics />} />
          <Route path={ROUTES.APPLICANTS} element={<Applicants />} />
          <Route path={ROUTES.CAREERS} element={<Careers />} />
          <Route path={ROUTES.PLACES} element={<Places />} />
          <Route path={ROUTES.LOCATION} element={<Location />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
