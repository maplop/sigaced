import { createContext, useContext, useEffect, useState } from "react";
import { User } from "src/shared/types";
import { login as loginUser } from "@renderer/api/user";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@renderer/routes/routes";

export interface AuthContextType {
  user: User | null,
  login: (username: string, password: string, rememberMe: boolean) => Promise<User | null>
  logout: () => void,
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("storedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate(ROUTES.STATISTICS)
    }
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean = false): Promise<User | null> => {
    try {
      const foundUser = await loginUser(username, password)
      if (!foundUser) return null

      setUser(foundUser)
      if (rememberMe) {
        localStorage.setItem('storedUser', JSON.stringify(foundUser))
      }

      return foundUser
    } catch (error) {
      console.error('Error al autenticar:', error)
      return null
    }
  }


  const logout = () => {
    navigate(ROUTES.LOGIN)
    setUser(null)
    localStorage.removeItem('storedUser')
  }

  const isAuthenticated = !!user

  return (
    <AuthContext value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthContextProvider");
  }
  return context;
};

