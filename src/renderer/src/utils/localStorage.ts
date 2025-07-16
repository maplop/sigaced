import { User } from "src/shared/types"

export const getUser = (id: string): User | null => {
  const storedUser = localStorage.getItem("storedUser") || sessionStorage.getItem("storedUser")
  if (!storedUser) return null

  const user: User = JSON.parse(storedUser)

  return user.id === id ? user : null
}

export const updateUser = (updatedUser: User): void => {
  const localUser = localStorage.getItem("storedUser")
  const sessionUser = sessionStorage.getItem("storedUser")

  if (localUser) {
    const parsed = JSON.parse(localUser) as User
    if (parsed.id === updatedUser.id) {
      localStorage.setItem("storedUser", JSON.stringify(updatedUser))
      return
    }
  }

  if (sessionUser) {
    const parsed = JSON.parse(sessionUser) as User
    if (parsed.id === updatedUser.id) {
      sessionStorage.setItem("storedUser", JSON.stringify(updatedUser))
      return
    }
  }

  console.warn("No se encontró un usuario con el ID proporcionado para actualizar.")
}
