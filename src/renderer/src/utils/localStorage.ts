import { User } from "src/shared/types"

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
