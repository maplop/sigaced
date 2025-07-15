import { db } from "../database"
import { User } from "../../shared/types"

// Create
export function addUser(user: Omit<User, "id">) {
  const stmt = db.prepare(`
    INSERT INTO user (name, last_name, username, password, role)
    VALUES (@name, @last_name, @username, @password, @role)
  `)
  stmt.run({
    ...user,
    last_name: user.lastName
  })
}

// Read all
export function getUsers(): User[] {
  return db
    .prepare(
      `
      SELECT 
        id,
        name,
        last_name AS lastName,  
        username,
        password,
        role
      FROM user
    `
    )
    .all()
}

// Read one by ID
export function getUserById(id: string): User | undefined {
  return db
    .prepare(
      `
      SELECT 
        id,
        name,
        last_name AS lastName,
        username,
        password,
        role
      FROM user
      WHERE id = ?
    `
    )
    .get(id)
}

// Change Password
export function changeUserPassword(id: string, newPassword: string) {
  const stmt = db.prepare(`
    UPDATE user
    SET password = ?
    WHERE id = ?
  `)
  stmt.run(newPassword, id)
}

// Update
export function updateUser(user: User) {
  const stmt = db.prepare(`
    UPDATE user
    SET 
      name = @name,
      last_name = @last_name,
      username = @username,
      password = @password,
      role = @role
    WHERE id = @id
  `)
  stmt.run({
    ...user,
    last_name: user.lastName
  })
}

// Delete
export function deleteUser(id: string): boolean {
  const stmt = db.prepare("DELETE FROM user WHERE id = ?")
  const result = stmt.run(id)
  return result.changes > 0
}
