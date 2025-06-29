import { db } from '../database'
import { User } from '../../shared/types'

// Create
export function addUser(user: User) {
  const stmt = db.prepare(`
    INSERT INTO user (username, password, role)
    VALUES (@username, @password, @role)
  `)
  stmt.run(user)
}

// Read all
export function getUsers(): User[] {
  return db
    .prepare(
      `
    SELECT
      id,
      username,
      password,
      role
    FROM user
  `
    )
    .all()
}

// Read one by username
export function getUserByUsername(username: string): User | undefined {
  return db
    .prepare(
      `
    SELECT
      id,
      username,
      password,
      role
    FROM user
    WHERE username = ?
  `
    )
    .get(username)
}

// Change Password
export function changeUserPassword(id: number, newPassword: string) {
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
    SET username = @username,
        password = @password,
        role = @role
    WHERE id = @id
  `)
  stmt.run(user)
}

// Delete
export function deleteUser(id: number) {
  db.prepare('DELETE FROM user WHERE id = ?').run(id)
}

// Seed (optional)
export function seedUsers() {
  const insert = db.prepare(`
    INSERT INTO user (username, password, role)
    VALUES (?, ?, ?)
  `)

  const users = [
    ['admin', 'admin', 'admin'],
    ['viewer', '1234', 'viewer']
  ]

  const insertMany = db.transaction((users: any[]) => {
    for (const u of users) insert.run(...u)
  })

  insertMany(users)
}
