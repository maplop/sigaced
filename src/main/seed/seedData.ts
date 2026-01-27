/* eslint-disable prettier/prettier */
// Datos de muestra para poblar la base de datos

export interface CareerSeed {
  fullName: string
  abbreviation: string
  faculty: string
}

export interface LocationSeed {
  name: string
}

export interface SpotSeed {
  careerName: string
  locationName: string
  availableQuantity: number
}

export interface ApplicantSeed {
  ci: string
  name: string
  lastName: string
  grade: number
  gender: "M" | "F"
  municipality: string
  requestCount: number // 1-3 solicitudes
}

// Carreras: nombre completo, abreviatura = disciplina/especialidad (p. ej. "Ingeniería X" → "X"), facultad.
export const careersData: CareerSeed[] = [
  { fullName: "Medicina", abbreviation: "Medicina", faculty: "Ciencias de la Salud" },
  { fullName: "Enfermería", abbreviation: "Enfermería", faculty: "Ciencias de la Salud" },
  { fullName: "Farmacia", abbreviation: "Farmacia", faculty: "Ciencias de la Salud" },
  { fullName: "Odontología", abbreviation: "Odontología", faculty: "Ciencias de la Salud" },
  { fullName: "Veterinaria", abbreviation: "Veterinaria", faculty: "Ciencias de la Salud" },
  { fullName: "Ingeniería Informática", abbreviation: "Informática", faculty: "MFC" },
  { fullName: "Ingeniería Civil", abbreviation: "Civil", faculty: "Ingeniería" },
  { fullName: "Ingeniería Industrial", abbreviation: "Industrial", faculty: "Ingeniería" },
  { fullName: "Ingeniería Eléctrica", abbreviation: "Eléctrica", faculty: "Ingeniería" },
  { fullName: "Ingeniería Mecánica", abbreviation: "Mecánica", faculty: "Ingeniería" },
  { fullName: "Ingeniería Química", abbreviation: "Química", faculty: "Ingeniería" },
  { fullName: "Ingeniería en Telecomunicaciones", abbreviation: "Telecomunicaciones", faculty: "Ingeniería" },
  { fullName: "Arquitectura", abbreviation: "Arquitectura", faculty: "Ingeniería" },
  { fullName: "Contabilidad", abbreviation: "Contabilidad", faculty: "Ciencias Económicas" },
  { fullName: "Administración de Empresas", abbreviation: "Administración", faculty: "Ciencias Económicas" },
  { fullName: "Economía", abbreviation: "Economía", faculty: "Ciencias Económicas" },
  { fullName: "Derecho", abbreviation: "Derecho", faculty: "Humanidades" },
  { fullName: "Psicología", abbreviation: "Psicología", faculty: "Humanidades" },
  { fullName: "Educación", abbreviation: "Educación", faculty: "Humanidades" },
  { fullName: "Licenciatura en Historia", abbreviation: "Historia", faculty: "Humanidades" },
  { fullName: "Comunicación Social", abbreviation: "Comunicación", faculty: "Humanidades" },
  { fullName: "Licenciatura en Idiomas", abbreviation: "Idiomas", faculty: "Humanidades" },
  { fullName: "Matemáticas", abbreviation: "Matemáticas", faculty: "Ciencias" },
  { fullName: "Biología", abbreviation: "Biología", faculty: "Ciencias" },
  { fullName: "Licenciatura en Física", abbreviation: "Física", faculty: "Ciencias" },
  { fullName: "Licenciatura en Química", abbreviation: "Química", faculty: "Ciencias" },
]

// Ubicaciones (sedes y filiales)
export const locationsData: LocationSeed[] = [
  { name: "Sede Central" },
  { name: "Sede Norte" },
  { name: "Sede Sur" },
  { name: "Sede Este" },
  { name: "Sede Oeste" },
  { name: "Sede Centro" },
  { name: "Sede Universitaria" },
  { name: "Sede Tecnológica" },
  { name: "Filial Norte" },
  { name: "Filial Sur" },
  { name: "Sede del Litoral" },
  { name: "Sede Valle" },
]

// Plazas para fase 1 (distribución variada por carrera-ubicación)
export const spotsData: SpotSeed[] = [
  // Medicina
  { careerName: "Medicina", locationName: "Sede Central", availableQuantity: 8 },
  { careerName: "Medicina", locationName: "Sede Norte", availableQuantity: 5 },
  { careerName: "Medicina", locationName: "Sede Sur", availableQuantity: 4 },
  { careerName: "Medicina", locationName: "Sede Universitaria", availableQuantity: 4 },
  { careerName: "Medicina", locationName: "Filial Norte", availableQuantity: 3 },
  // Ingeniería Informática
  { careerName: "Ingeniería Informática", locationName: "Sede Central", availableQuantity: 10 },
  { careerName: "Ingeniería Informática", locationName: "Sede Norte", availableQuantity: 6 },
  { careerName: "Ingeniería Informática", locationName: "Sede Este", availableQuantity: 5 },
  { careerName: "Ingeniería Informática", locationName: "Sede Tecnológica", availableQuantity: 6 },
  { careerName: "Ingeniería Informática", locationName: "Sede Universitaria", availableQuantity: 4 },
  // Derecho
  { careerName: "Derecho", locationName: "Sede Central", availableQuantity: 7 },
  { careerName: "Derecho", locationName: "Sede Sur", availableQuantity: 4 },
  { careerName: "Derecho", locationName: "Sede Universitaria", availableQuantity: 4 },
  { careerName: "Derecho", locationName: "Filial Sur", availableQuantity: 3 },
  // Contabilidad
  { careerName: "Contabilidad", locationName: "Sede Central", availableQuantity: 6 },
  { careerName: "Contabilidad", locationName: "Sede Norte", availableQuantity: 4 },
  { careerName: "Contabilidad", locationName: "Sede Este", availableQuantity: 3 },
  { careerName: "Contabilidad", locationName: "Sede del Litoral", availableQuantity: 3 },
  // Enfermería
  { careerName: "Enfermería", locationName: "Sede Central", availableQuantity: 5 },
  { careerName: "Enfermería", locationName: "Sede Sur", availableQuantity: 3 },
  { careerName: "Enfermería", locationName: "Filial Norte", availableQuantity: 3 },
  // Ingeniería Civil
  { careerName: "Ingeniería Civil", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Ingeniería Civil", locationName: "Sede Norte", availableQuantity: 3 },
  { careerName: "Ingeniería Civil", locationName: "Sede Tecnológica", availableQuantity: 3 },
  // Administración de Empresas
  { careerName: "Administración de Empresas", locationName: "Sede Central", availableQuantity: 5 },
  { careerName: "Administración de Empresas", locationName: "Sede Este", availableQuantity: 3 },
  { careerName: "Administración de Empresas", locationName: "Sede Valle", availableQuantity: 3 },
  // Psicología
  { careerName: "Psicología", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Psicología", locationName: "Sede Oeste", availableQuantity: 3 },
  { careerName: "Psicología", locationName: "Sede Universitaria", availableQuantity: 3 },
  // Ingeniería Industrial
  { careerName: "Ingeniería Industrial", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Ingeniería Industrial", locationName: "Sede Norte", availableQuantity: 3 },
  { careerName: "Ingeniería Industrial", locationName: "Sede Tecnológica", availableQuantity: 4 },
  // Farmacia
  { careerName: "Farmacia", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Farmacia", locationName: "Sede Sur", availableQuantity: 2 },
  { careerName: "Farmacia", locationName: "Filial Sur", availableQuantity: 2 },
  // Educación
  { careerName: "Educación", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Educación", locationName: "Sede Centro", availableQuantity: 3 },
  { careerName: "Educación", locationName: "Sede Valle", availableQuantity: 3 },
  // Economía
  { careerName: "Economía", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Economía", locationName: "Sede Este", availableQuantity: 2 },
  { careerName: "Economía", locationName: "Sede del Litoral", availableQuantity: 2 },
  // Ingeniería Eléctrica
  { careerName: "Ingeniería Eléctrica", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Ingeniería Eléctrica", locationName: "Sede Norte", availableQuantity: 2 },
  { careerName: "Ingeniería Eléctrica", locationName: "Sede Tecnológica", availableQuantity: 3 },
  // Matemáticas
  { careerName: "Matemáticas", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Matemáticas", locationName: "Sede Centro", availableQuantity: 2 },
  { careerName: "Matemáticas", locationName: "Sede Universitaria", availableQuantity: 3 },
  // Biología
  { careerName: "Biología", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Biología", locationName: "Sede Sur", availableQuantity: 2 },
  { careerName: "Biología", locationName: "Sede del Litoral", availableQuantity: 2 },
  // Odontología
  { careerName: "Odontología", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Odontología", locationName: "Sede Norte", availableQuantity: 3 },
  { careerName: "Odontología", locationName: "Sede Universitaria", availableQuantity: 2 },
  // Veterinaria
  { careerName: "Veterinaria", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Veterinaria", locationName: "Sede Sur", availableQuantity: 3 },
  { careerName: "Veterinaria", locationName: "Sede Valle", availableQuantity: 2 },
  // Ingeniería Mecánica
  { careerName: "Ingeniería Mecánica", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Ingeniería Mecánica", locationName: "Sede Tecnológica", availableQuantity: 4 },
  { careerName: "Ingeniería Mecánica", locationName: "Filial Norte", availableQuantity: 2 },
  // Ingeniería Química
  { careerName: "Ingeniería Química", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Ingeniería Química", locationName: "Sede Tecnológica", availableQuantity: 3 },
  { careerName: "Ingeniería Química", locationName: "Sede del Litoral", availableQuantity: 2 },
  // Ingeniería en Telecomunicaciones
  { careerName: "Ingeniería en Telecomunicaciones", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Ingeniería en Telecomunicaciones", locationName: "Sede Tecnológica", availableQuantity: 5 },
  { careerName: "Ingeniería en Telecomunicaciones", locationName: "Sede Universitaria", availableQuantity: 3 },
  // Arquitectura
  { careerName: "Arquitectura", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Arquitectura", locationName: "Sede Norte", availableQuantity: 3 },
  { careerName: "Arquitectura", locationName: "Filial Sur", availableQuantity: 2 },
  // Licenciatura en Historia
  { careerName: "Licenciatura en Historia", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Licenciatura en Historia", locationName: "Sede Universitaria", availableQuantity: 3 },
  { careerName: "Licenciatura en Historia", locationName: "Sede Valle", availableQuantity: 2 },
  // Comunicación Social
  { careerName: "Comunicación Social", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Comunicación Social", locationName: "Sede Este", availableQuantity: 3 },
  // Licenciatura en Idiomas
  { careerName: "Licenciatura en Idiomas", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Licenciatura en Idiomas", locationName: "Sede Universitaria", availableQuantity: 3 },
  { careerName: "Licenciatura en Idiomas", locationName: "Filial Norte", availableQuantity: 2 },
  // Licenciatura en Física
  { careerName: "Licenciatura en Física", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Licenciatura en Física", locationName: "Sede Universitaria", availableQuantity: 3 },
  // Licenciatura en Química
  { careerName: "Licenciatura en Química", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Licenciatura en Química", locationName: "Sede Tecnológica", availableQuantity: 3 },
  { careerName: "Licenciatura en Química", locationName: "Sede del Litoral", availableQuantity: 2 },
]

// Nombres y apellidos para generar estudiantes
const firstNames = [
  "Juan", "María", "Carlos", "Ana", "Luis", "Laura", "Pedro", "Carmen",
  "José", "Patricia", "Miguel", "Sofía", "Roberto", "Isabel", "Fernando", "Lucía",
  "Diego", "Elena", "Andrés", "Mónica", "Ricardo", "Andrea", "Javier", "Natalia",
  "Daniel", "Valentina", "Alejandro", "Camila", "Manuel", "Gabriela", "Sergio", "Mariana",
  "Francisco", "Daniela", "Antonio", "Paula", "Rafael", "Alejandra", "Eduardo", "Claudia",
  "Ángel", "Diana", "Óscar", "Verónica", "Héctor", "Rosa", "Víctor", "Teresa",
  "Raúl", "Marta", "Alberto", "Cristina", "Enrique", "Beatriz", "Jorge", "Adriana"
]

const lastNames = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez",
  "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Álvarez",
  "Muñoz", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez",
  "Ramos", "Gil", "Ramírez", "Serrano", "Blanco", "Suárez", "Molina", "Morales",
  "Ortega", "Delgado", "Castro", "Ortiz", "Rubio", "Marín", "Sanz", "Iglesias",
  "Nuñez", "Medina", "Garrido", "Cortés", "Castillo", "Santos", "Lozano", "Guerrero"
]

const municipalities = [
  "La Habana", "Santiago de Cuba", "Camagüey", "Holguín", "Santa Clara",
  "Guantánamo", "Pinar del Río", "Matanzas", "Cienfuegos", "Las Tunas",
  "Bayamo", "Ciego de Ávila"
]

// Generar CIs únicos de 11 dígitos numéricos
function generateCI(index: number): string {
  // Asegurar que siempre sea exactamente 11 dígitos
  // Usar un rango que garantice 11 dígitos: 10000000000 a 99999999999
  const base = 10000000000 + (index % 90000000000)
  return base.toString().padStart(11, '0')
}

// Generar calificación entre 60.00 y 100.00 con 2 decimales (promedio del aspirante)
function generateGrade(index: number, total: number): number {
  const percentile = index / total
  let grade: number
  if (percentile < 0.1) {
    grade = 90 + Math.random() * 10
  } else if (percentile < 0.3) {
    grade = 80 + Math.random() * 9
  } else if (percentile < 0.7) {
    grade = 70 + Math.random() * 9
  } else if (percentile < 0.9) {
    grade = 60 + Math.random() * 9
  } else {
    grade = 60 + Math.random() * 5
  }
  // Redondear a exactamente 2 decimales y asegurar que esté entre 60.00 y 100.00
  const rounded = Math.round(grade * 100) / 100
  return Math.max(60.00, Math.min(100.00, parseFloat(rounded.toFixed(2))))
}

// Generar número de solicitudes (1-3)
// Asegurar que todos tengan al menos 1 solicitud y máximo 3
function generateRequestCount(): number {
  const rand = Math.random()
  // Distribución: 30% con 1 solicitud, 40% con 2, 30% con 3
  if (rand < 0.3) return 1
  if (rand < 0.7) return 2
  return 3
}

// Generar aspirantes
export function generateApplicantsData(count: number = 100): ApplicantSeed[] {
  const applicants: ApplicantSeed[] = []
  const usedCIs = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    let ci: string
    do {
      ci = generateCI(i)
    } while (usedCIs.has(ci))
    usedCIs.add(ci)
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)]
    const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)]
    const fullLastName = `${lastName1} ${lastName2}`
    
    const grade = generateGrade(i, count)
    const gender: "M" | "F" = Math.random() < 0.5 ? "M" : "F"
    const municipality = municipalities[Math.floor(Math.random() * municipalities.length)]
    const requestCount = generateRequestCount()
    
    applicants.push({
      ci,
      name: firstName,
      lastName: fullLastName,
      grade,
      gender,
      municipality,
      requestCount
    })
  }
  
  // Ordenar por calificación descendente (como se procesan en el sistema)
  return applicants.sort((a, b) => b.grade - a.grade)
}
