import { User } from "src/shared/types"

export const login = async (username: string, password: string): Promise<User | null> => {
  const users = await window.api.getUsers()
  return users.find((u) => u.username === username && u.password === password) ?? null
}

export const register = async (user: Omit<User, "id" | "createdAt">): Promise<User> => {
  const allUsers = await window.api.getUsers()
  const usernameTaken = allUsers.some((u) => u.username === user.username)
  if (usernameTaken) throw new Error("Nombre de usuario ya está en uso")
  await window.api.addUser(user)
  return user as User
}

export const getAllUsers = async (): Promise<User[]> => {
  return await window.api.getUsers()
}

export const getUserById = async (id: string): Promise<User | null> => {
  return (await window.api.getUserById(id)) ?? null
}

export const updateUser = async (user: Omit<User, "createdAt">): Promise<void> => {
  const allUsers = await window.api.getUsers()
  const usernameTaken = allUsers.some((u) => u.username === user.username && u.id !== user.id)
  if (usernameTaken) throw new Error("Nombre de usuario ya está en uso")
  await window.api.updateUser(user)
}

export const deleteUser = async (id: string): Promise<void> => {
  const success = await window.api.deleteUser(id)
  if (!success) throw new Error("Error al eliminar el usuario")
}

export const changePassword = async (id: string, newPassword: string): Promise<void> => {
  const allUsers = await window.api.getUsers()
  const userExists = allUsers.some((u) => u.id === id)
  if (!userExists) throw new Error("Usuario no encontrado")
  await window.api.changeUserPassword({ id, newPassword })
}
