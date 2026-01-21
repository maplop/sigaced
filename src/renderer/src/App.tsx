/* eslint-disable prettier/prettier */
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './components/Auth/Auth'
import MainLayout from './layouts/MainLayout'
import Statistics from './pages/Statistics'
import Careers from './pages/Careers'
import Location from './pages/Location'
import ManageUsersPage from './pages/User/ManageUsers'
import ProfilePage from './pages/User/Profile'
import FirstAllocations from './pages/FirstAllocations'
import SecondAllocations from './pages/SecondAllocations'
import ManualAllocations from './pages/ManualAllocations'
import { ROUTES } from './routes/routes'
import { Toaster } from './components/ui/sonner'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import FinalList from './pages/FinalList'
import Reports from './pages/Reports'

const queryClient = new QueryClient()

function App(): React.JSX.Element {

  return (
    <QueryClientProvider client={queryClient} >
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path={ROUTES.LOGIN} element={<Auth />} />
          <Route path={ROUTES.REGISTER} element={<Auth />} />

          <Route element={<MainLayout />}>
            <Route index path={ROUTES.STATISTICS} element={<Statistics />} />
            <Route path={ROUTES.CAREERS} element={<Careers />} />
            <Route path={ROUTES.LOCATION} element={<Location />} />

            <Route path={ROUTES.FIRST_ALLOCATION} element={<FirstAllocations />} />
            <Route path={ROUTES.SECOND_ALLOCATION} element={<SecondAllocations />} />
            <Route path={ROUTES.MANUAL_ALLOCATION} element={<ManualAllocations />} />

            <Route path={ROUTES.FINAL_LIST} element={<FinalList />} />

            <Route path={ROUTES.REPORTS} element={<Reports />} />

            <Route path={ROUTES.MANAGE_USERS} element={<ManageUsersPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </QueryClientProvider>
  )
}

export default App
