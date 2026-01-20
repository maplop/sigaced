import { createContext, useContext, useEffect, useState } from "react";
import { User } from "src/shared/types";
import { getUserById, login as loginUser } from "@renderer/api/user";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@renderer/routes/routes";

export interface AuthContextType {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  login: (username: string, password: string, rememberMe: boolean) => Promise<User | null>
  logout: () => void,
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("storedUser") || sessionStorage.getItem("storedUser")
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      localStorage.removeItem("storedUser")
      sessionStorage.removeItem("storedUser")
      return null
    }
  })

  const location = useLocation()

  // Al iniciar: si hay user en storage, validar que sigue existiendo en la BD.
  useEffect(() => {
    if (!user) return
    getUserById(user.id)
      .then((dbUser) => {
        if (dbUser == null) {
          setUser(null)
          localStorage.removeItem("storedUser")
          sessionStorage.removeItem("storedUser")
        }
      })
      .catch(() => { })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- solo al montar, con el user restaurado

  useEffect(() => {
    if (user && location.pathname === ROUTES.LOGIN) {
      navigate(ROUTES.STATISTICS);
    }
  }, [user, location.pathname]);

  const login = async (username: string, password: string, rememberMe: boolean = false): Promise<User | null> => {
    try {
      const foundUser = await loginUser(username, password)
      if (!foundUser) return null

      setUser(foundUser)
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("storedUser", JSON.stringify(foundUser))
        ; (rememberMe ? sessionStorage : localStorage).removeItem("storedUser")

      return foundUser
    } catch (error) {
      console.error('Error al autenticar:', error)
      return null
    }
  }

  const logout = () => {
    navigate(ROUTES.LOGIN)
    setUser(null)
    localStorage.removeItem("storedUser");
    sessionStorage.removeItem("storedUser");
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthContextProvider");
  }
  return context;
};

