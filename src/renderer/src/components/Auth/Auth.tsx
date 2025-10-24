import Login from './Login/Login'
import Register from './Register/Register'
import { GraduationCap, User, UserPlus } from 'lucide-react'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '../ui/tabs'
import { useLocation, useNavigate } from 'react-router-dom'

const Auth = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const currentTab = location.pathname === '/register' ? 'register' : 'login'

  const handleTabChange = (value: string) => {
    if (value !== currentTab) {
      navigate(`/${value}`)
    }
  }

  return (
    <div className='flex flex-col w-96'>
      <div className="flex gap-4 mb-8">
        <div className="mx-auto min-w-16 w-16 h-16 bg-[#0F172B] rounded-lg flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <div className='flex flex-col justify-between'>
          <div className="text-2xl font-bold leading-none text-[#0F172B]">GAPCED</div>
          <div className="text-sm leading-4 text-gray-600">Gestión de Otorgamiento de Plazas del Curso por Encuentro y a Distancia</div>
        </div>
      </div>
      <Tabs defaultValue="login" value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Iniciar Sesión
          </TabsTrigger>
          <TabsTrigger value="register" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Registrarse
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="register">
          <Register />
        </TabsContent>
      </Tabs>
      <div className="text-center text-sm leading-4 text-gray-600 mt-5">Universidad Central "Marta Abreu" de Las Villas</div>
    </div>
  )
}
export default Auth
