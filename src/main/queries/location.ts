import { db } from "../database"
import { Location } from "../../shared/types"

// Create
export function addLocation(location: Omit<Location, "id">): void {
  const stmt = db.prepare(`
    INSERT INTO location (name)
    VALUES (@name)
  `)
  stmt.run(location)
}

// Read all
export function getLocations(): Location[] {
  return db.prepare("SELECT id, name FROM location").all()
}

// Read one by name
export function getLocationByName(name: string): Location | undefined {
  return db.prepare("SELECT id, name FROM location WHERE name = ?").get(name)
}

// Update
export function updateLocation(location: Location): void {
  const stmt = db.prepare(`
    UPDATE location 
    SET name = @name
    WHERE id = @id
  `)
  stmt.run(location)
}

// Delete
export function deleteLocation(id: number): void {
  db.prepare("DELETE FROM location WHERE id = ?").run(id)
}
