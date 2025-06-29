import { db } from '../database'
import { Location } from '../../shared/types'

// Create
export function addLocation(location: Location) {
  const stmt = db.prepare(`
    INSERT INTO location (id, name) VALUES (@id, @name)
    `)
  stmt.run(location)
}

// Read all
export function getLocations(): Location[] {
  return db.prepare('SELECT * FROM location').all()
}

// Read one by name
export function getLocationByName(name: string): Location {
  return db.prepare('SELECT * FROM location WHERE name = ?').get(name)
}

// Update
export function updateLocation(location: Location) {
  const stmt = db.prepare(`
    UPDATE location 
    SET name = @name
    WHERE id =@id
    `)
  stmt.run(location)
}

// Delete
export function deleteLocation(id: number) {
  db.prepare('DELETE FROM location id = ?').run(id)
}
