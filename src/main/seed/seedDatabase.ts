/* eslint-disable prettier/prettier */
import { db } from "../database"
import {
  careersData,
  locationsData,
  spotsData,
  generateStudentsData,
  type CareerSeed,
  type LocationSeed,
  type SpotSeed,
  type StudentSeed
} from "./seedData"

const PHASE_ID = 1 // Fase primera

interface SeedResult {
  careers: number
  locations: number
  spots: number
  students: number
  studentPhases: number
  requests: number
  errors: string[]
}

/**
 * Pobla la base de datos con datos de muestra para fase 1
 * @param studentCount Número de estudiantes a generar (default: 100)
 * @returns Resultado del proceso de población
 */
export function seedDatabase(studentCount: number = 100): SeedResult {
  const result: SeedResult = {
    careers: 0,
    locations: 0,
    spots: 0,
    students: 0,
    studentPhases: 0,
    requests: 0,
    errors: []
  }

  try {
    // Usar transacción para garantizar atomicidad
    const transaction = db.transaction(() => {
      // 1. Insertar carreras
      const careerMap = new Map<string, number>() // nombre -> id
      const insertCareer = db.prepare(`
        INSERT INTO career (full_name, abbreviation, faculty)
        VALUES (?, ?, ?)
      `)

      for (const career of careersData) {
        try {
          const result = insertCareer.run(career.fullName, career.abbreviation, career.faculty)
          careerMap.set(career.fullName, result.lastInsertRowid as number)
          result.careers++
        } catch (error: any) {
          if (!error.message.includes("UNIQUE constraint")) {
            result.errors.push(`Error insertando carrera ${career.fullName}: ${error.message}`)
          }
        }
      }

      // 2. Insertar ubicaciones
      const locationMap = new Map<string, number>() // nombre -> id
      const insertLocation = db.prepare(`
        INSERT INTO location (name)
        VALUES (?)
      `)

      for (const location of locationsData) {
        try {
          const result = insertLocation.run(location.name)
          locationMap.set(location.name, result.lastInsertRowid as number)
          result.locations++
        } catch (error: any) {
          if (!error.message.includes("UNIQUE constraint")) {
            result.errors.push(`Error insertando ubicación ${location.name}: ${error.message}`)
          }
        }
      }

      // 3. Insertar plazas (spots) para fase 1
      const spotMap = new Map<string, number>() // "careerName-locationName" -> spotId
      const insertSpot = db.prepare(`
        INSERT INTO spot (career_id, location_id, phase_id, available_quantity)
        VALUES (?, ?, ?, ?)
      `)

      for (const spot of spotsData) {
        const careerId = careerMap.get(spot.careerName)
        const locationId = locationMap.get(spot.locationName)

        if (!careerId || !locationId) {
          result.errors.push(
            `No se encontró carrera o ubicación para spot: ${spot.careerName} - ${spot.locationName}`
          )
          continue
        }

        try {
          const spotResult = insertSpot.run(careerId, locationId, PHASE_ID, spot.availableQuantity)
          const spotKey = `${spot.careerName}-${spot.locationName}`
          spotMap.set(spotKey, spotResult.lastInsertRowid as number)
          result.spots++
        } catch (error: any) {
          if (!error.message.includes("UNIQUE constraint")) {
            result.errors.push(
              `Error insertando spot ${spot.careerName} - ${spot.locationName}: ${error.message}`
            )
          }
        }
      }

      // 4. Generar y insertar estudiantes
      const studentsData = generateStudentsData(studentCount)
      const studentMap = new Map<number, number>() // índice -> studentId
      const insertStudent = db.prepare(`
        INSERT INTO student (ci, name, last_name, grade, gender, municipality)
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      for (let i = 0; i < studentsData.length; i++) {
        const student = studentsData[i]
        try {
          const studentResult = insertStudent.run(
            student.ci,
            student.name,
            student.lastName,
            student.grade,
            student.gender,
            student.municipality
          )
          studentMap.set(i, studentResult.lastInsertRowid as number)
          result.students++
        } catch (error: any) {
          if (!error.message.includes("UNIQUE constraint")) {
            result.errors.push(`Error insertando estudiante ${student.ci}: ${error.message}`)
          }
        }
      }

      // 5. Insertar student_phase (todos en fase 1)
      const insertStudentPhase = db.prepare(`
        INSERT INTO student_phase (student_id, phase_id)
        VALUES (?, ?)
      `)

      for (const studentId of studentMap.values()) {
        try {
          insertStudentPhase.run(studentId, PHASE_ID)
          result.studentPhases++
        } catch (error: any) {
          if (!error.message.includes("UNIQUE constraint")) {
            result.errors.push(
              `Error insertando student_phase para estudiante ${studentId}: ${error.message}`
            )
          }
        }
      }

      // 6. Insertar solicitudes (requests)
      // Necesitamos distribuir las solicitudes de manera realista
      const availableSpots = Array.from(spotMap.entries())
      const insertRequest = db.prepare(`
        INSERT INTO request (student_id, spot_id, preference_order)
        VALUES (?, ?, ?)
      `)

      // Crear lista de spots con información de carrera para distribución realista
      const spotsWithInfo = spotsData
        .map((spot) => {
          const spotKey = `${spot.careerName}-${spot.locationName}`
          const spotId = spotMap.get(spotKey)
          return { spotId, careerName: spot.careerName, locationName: spot.locationName }
        })
        .filter((s) => s.spotId !== undefined) as Array<{
        spotId: number
        careerName: string
        locationName: string
      }>

      // Carreras más populares (para distribución realista de solicitudes)
      const popularCareers = ["Medicina", "Ingeniería Informática", "Derecho", "Contabilidad"]

      for (let i = 0; i < studentsData.length; i++) {
        const student = studentsData[i]
        const studentId = studentMap.get(i)

        if (!studentId) continue

        const requestCount = student.requestCount

        // Seleccionar spots para este estudiante
        // Los estudiantes con mejores calificaciones tienden a solicitar carreras más populares
        const studentSpots: Array<{ spotId: number; preferenceOrder: number }> = []
        const usedSpotIds = new Set<number>()

        for (let pref = 1; pref <= requestCount; pref++) {
          let selectedSpot: { spotId: number; careerName: string; locationName: string } | null =
            null

          // Intentar seleccionar un spot que no haya sido usado
          let attempts = 0
          const maxAttempts = 50

          while (!selectedSpot && attempts < maxAttempts) {
            // Distribución: estudiantes con mejores calificaciones prefieren carreras populares
            const isTopStudent = student.grade >= 80
            const preferPopular = isTopStudent && Math.random() < 0.6

            let candidateSpots = preferPopular
              ? spotsWithInfo.filter((s) => popularCareers.includes(s.careerName))
              : spotsWithInfo

            // Si no hay spots disponibles en la categoría preferida, usar todos
            if (candidateSpots.length === 0) {
              candidateSpots = spotsWithInfo
            }

            const randomSpot = candidateSpots[Math.floor(Math.random() * candidateSpots.length)]

            if (!usedSpotIds.has(randomSpot.spotId)) {
              selectedSpot = randomSpot
              usedSpotIds.add(randomSpot.spotId)
            }

            attempts++
          }

          // Si no se encontró spot único, seleccionar cualquier disponible
          if (!selectedSpot) {
            const available = spotsWithInfo.filter((s) => !usedSpotIds.has(s.spotId))
            if (available.length > 0) {
              selectedSpot = available[Math.floor(Math.random() * available.length)]
              usedSpotIds.add(selectedSpot.spotId)
            }
          }

          if (selectedSpot) {
            studentSpots.push({
              spotId: selectedSpot.spotId,
              preferenceOrder: pref
            })
          }
        }

        // Insertar las solicitudes del estudiante
        for (const req of studentSpots) {
          try {
            insertRequest.run(studentId, req.spotId, req.preferenceOrder)
            result.requests++
          } catch (error: any) {
            if (!error.message.includes("UNIQUE constraint")) {
              result.errors.push(
                `Error insertando request para estudiante ${studentId}, spot ${req.spotId}: ${error.message}`
              )
            }
          }
        }
      }
    })

    // Ejecutar la transacción
    transaction()
  } catch (error: any) {
    result.errors.push(`Error general en la transacción: ${error.message}`)
  }

  return result
}

/**
 * Limpia las tablas antes de poblar (opcional)
 */
export function clearSeedTables(): void {
  const transaction = db.transaction(() => {
    db.prepare("DELETE FROM request").run()
    db.prepare("DELETE FROM student_phase").run()
    db.prepare("DELETE FROM assignment").run()
    db.prepare("DELETE FROM spot").run()
    db.prepare("DELETE FROM student").run()
    db.prepare("DELETE FROM location").run()
    db.prepare("DELETE FROM career").run()

    // Reiniciar autoincrementos
    db.prepare(
      "DELETE FROM sqlite_sequence WHERE name IN ('career', 'location', 'spot', 'student', 'student_phase', 'request', 'assignment')"
    ).run()
  })

  transaction()
}

/**
 * Valida que los datos insertados sean correctos
 * @param phaseId ID de la fase a validar (default: 1)
 */
export function validateSeedData(phaseId: number = PHASE_ID): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Verificar que todos los estudiantes tienen al menos 1 solicitud
  const studentsWithoutRequests = db
    .prepare(
      `
    SELECT COUNT(*) as count
    FROM student s
    JOIN student_phase sp ON sp.student_id = s.id
    WHERE sp.phase_id = ? AND s.id NOT IN (
      SELECT DISTINCT student_id FROM request
    )
  `
    )
    .get(phaseId) as { count: number }

  if (studentsWithoutRequests.count > 0) {
    errors.push(`${studentsWithoutRequests.count} estudiantes no tienen solicitudes`)
  }

  // Verificar que ningún estudiante tiene más de 3 solicitudes en fase 1
  const studentsWithTooManyRequests = db
    .prepare(
      `
    SELECT s.id, s.ci, COUNT(r.id) as request_count
    FROM student s
    JOIN request r ON r.student_id = s.id
    JOIN spot sp ON sp.id = r.spot_id
    WHERE sp.phase_id = ?
    GROUP BY s.id
    HAVING request_count > 3
  `
    )
    .all(phaseId) as Array<{ id: number; ci: string; request_count: number }>

  if (studentsWithTooManyRequests.length > 0) {
    errors.push(
      `${studentsWithTooManyRequests.length} estudiantes tienen más de 3 solicitudes: ${studentsWithTooManyRequests.map((s) => s.ci).join(", ")}`
    )
  }

  // Verificar que todas las solicitudes tienen preference_order válido
  const invalidPreferenceOrders = db
    .prepare(
      `
    SELECT COUNT(*) as count
    FROM request
    WHERE preference_order NOT IN (1, 2, 3) OR preference_order IS NULL
  `
    )
    .get() as { count: number }

  if (invalidPreferenceOrders.count > 0) {
    errors.push(`${invalidPreferenceOrders.count} solicitudes tienen preference_order inválido`)
  }

  // Verificar que hay más estudiantes que plazas (competencia realista)
  const totalStudents = db
    .prepare(
      `
    SELECT COUNT(DISTINCT s.id) as count
    FROM student s
    JOIN student_phase sp ON sp.student_id = s.id
    WHERE sp.phase_id = ?
  `
    )
    .get(phaseId) as { count: number }

  const totalSpots = db
    .prepare(
      `
    SELECT SUM(available_quantity) as total
    FROM spot
    WHERE phase_id = ?
  `
    )
    .get(phaseId) as { total: number }

  if (totalSpots.total && totalStudents.count <= totalSpots.total) {
    warnings.push(
      `Hay ${totalStudents.count} estudiantes y ${totalSpots.total} plazas. Para competencia realista, debería haber más estudiantes que plazas.`
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
