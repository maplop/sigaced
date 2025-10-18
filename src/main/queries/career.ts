import { db } from "../database"
import { Career } from "../../shared/types"

// Create
export function addCareer(career: Career) {
  const stmt = db.prepare(`
    INSERT INTO career (full_name, abbreviation, faculty)
    VALUES (@fullName, @abbreviation, @faculty)
  `)
  stmt.run(career)
}

// Read all
export function getCareers(): Career[] {
  return db
    .prepare(
      `
    SELECT 
      id, 
      full_name AS fullName, 
      abbreviation, 
      faculty 
    FROM career
  `
    )
    .all()
}

// Read one by name
export function getCareerByName(name: string): Career | undefined {
  return db
    .prepare(
      `
    SELECT 
      id, 
      full_name AS fullName, 
      abbreviation, 
      faculty 
    FROM career 
    WHERE full_name = ?
  `
    )
    .get(name)
}

// Update
export function updateCareer(career: Career) {
  const stmt = db.prepare(`
    UPDATE career 
    SET 
      full_name = @fullName,
      abbreviation = @abbreviation,
      faculty = @faculty 
    WHERE id = @id
  `)
  stmt.run(career)
}

// Delete
export function deleteCareer(id: number) {
  db.prepare("DELETE FROM career WHERE id = ?").run(id)
}

// Delete all careers
export function deleteAllCareers() {
  const transaction = db.transaction(() => {
    db.prepare("DELETE FROM career").run()
  })

  transaction()
}
