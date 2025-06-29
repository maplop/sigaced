import { db } from '../database'
import { Student } from '../../shared/types'

// Create
export function addStudent(student: Student) {
  const stmt = db.prepare(`
    INSERT INTO student (ci, first_name, last_name_1, last_name_2, grade, age, gender, municipality)
    VALUES (@ci, @firstName, @firstLastName, @secondLastName, @grade, @age, @gender, @municipality)
  `)
  stmt.run(student)
}

// Read all
export function getStudents(): Student[] {
  return db
    .prepare(
      `
    SELECT
      ci,
      first_name AS firstName,
      last_name_1 AS firstLastName,
      last_name_2 AS secondLastName,
      grade,
      age,
      gender,
      municipality
    FROM student
  `
    )
    .all()
}

// Read one by CI
export function getStudentByCI(ci: string): Student | undefined {
  return db
    .prepare(
      `
    SELECT
      ci,
      first_name AS firstName,
      last_name_1 AS firstLastName,
      last_name_2 AS secondLastName,
      grade,
      age,
      gender,
      municipality
    FROM student
    WHERE ci = ?
  `
    )
    .get(ci)
}

// Update
export function updateStudent(student: Student) {
  const stmt = db.prepare(`
    UPDATE student
    SET first_name = @firstName,
        last_name_1 = @firstLastName,
        last_name_2 = @secondLastName,
        grade = @grade,
        age = @age,
        gender = @gender,
        municipality = @municipality
    WHERE ci = @ci
  `)
  stmt.run(student)
}

// Delete
export function deleteStudent(ci: string) {
  db.prepare('DELETE FROM student WHERE ci = ?').run(ci)
}

// Seed
export function seedStudents() {
  const insert = db.prepare(`
    INSERT INTO student (ci, first_name, last_name_1, last_name_2, grade, age, gender, municipality)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const students = [
    ['12345678', 'Juan', 'Perez', 'Lopez', 8.5, 20, 'M', 'Madrid'],
    ['87654321', 'Maria', 'Garcia', '', 9.2, 21, 'F', 'Barcelona'],
    ['11223344', 'Carlos', 'Rodriguez', 'Sanchez', 7.8, 22, 'M', 'Valencia']
  ]

  const insertMany = db.transaction((students: any[]) => {
    for (const s of students) insert.run(...s)
  })

  insertMany(students)
}
