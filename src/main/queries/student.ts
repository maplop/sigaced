import { db } from "../database"
import { Student } from "../../shared/types"

// Create
export function addStudent(student: Student): void {
  const stmt = db.prepare(`
    INSERT INTO student (ci, name, last_name, grade, age, gender, municipality)
    VALUES (@ci, @name, @lastName, @grade, @age, @gender, @municipality)
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
      name,
      last_name AS lastName,
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
      name,
      last_name AS lastName,
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
export function updateStudent(student: Student): void {
  const stmt = db.prepare(`
    UPDATE student
    SET 
      name = @name,
      last_name = @lastName,
      grade = @grade,
      age = @age,
      gender = @gender,
      municipality = @municipality
    WHERE ci = @ci
  `)
  stmt.run(student)
}

// Delete
export function deleteStudent(ci: string): void {
  db.prepare("DELETE FROM student WHERE ci = ?").run(ci)
}
