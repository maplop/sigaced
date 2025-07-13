import { User } from "src/shared/types"

export const login = async (username: string, password: string): Promise<User | null> => {
  const users = await window.api.getUsers()
  const user = users.find((u) => u.username === username && u.password === password)
  return user ?? null
}

export const register = async (user: Omit<User, "id">): Promise<User | null> => {
  const allUsers = await window.api.getUsers()
  const usernameTaken = allUsers.some((u) => u.username === user.username)

  if (usernameTaken) return null

  await window.api.addUser(user)
  return user as User
}

export const getAllUsers = async (): Promise<User[]> => {
  const users = (await window.api.getUsers()) ?? []
  return users
}

export const changePassword = async (id: string, newPassword: string): Promise<boolean> => {
  const allUsers = await window.api.getUsers()
  const user = allUsers.find((u) => u.id === id)

  if (!user) return false

  await window.api.changeUserPassword({ id: user.id, newPassword })
  return true
}

export const updateUser = async (user: User): Promise<boolean> => {
  if (!user.id) {
    return false
  }

  await window.api.updateUser(user)
  return true
}

export const deleteUser = async (id: string): Promise<boolean> => {
  const allUsers = await window.api.getUsers()
  const user = allUsers.find((u) => u.id === id)

  if (!user) return false

  await window.api.deleteUser(id)
  return true
}
