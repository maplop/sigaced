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

// Carreras (12-15 carreras de diferentes facultades)
export const careersData: CareerSeed[] = [
  // Facultad de Ciencias de la Salud
  { fullName: "Medicina", abbreviation: "MED", faculty: "Ciencias de la Salud" },
  { fullName: "Enfermería", abbreviation: "ENF", faculty: "Ciencias de la Salud" },
  { fullName: "Farmacia", abbreviation: "FAR", faculty: "Ciencias de la Salud" },
  
  // Facultad de Ingeniería
  { fullName: "Ingeniería Informática", abbreviation: "INF", faculty: "Ingeniería" },
  { fullName: "Ingeniería Civil", abbreviation: "CIV", faculty: "Ingeniería" },
  { fullName: "Ingeniería Industrial", abbreviation: "IND", faculty: "Ingeniería" },
  { fullName: "Ingeniería Eléctrica", abbreviation: "ELE", faculty: "Ingeniería" },
  
  // Facultad de Ciencias Económicas
  { fullName: "Contabilidad", abbreviation: "CON", faculty: "Ciencias Económicas" },
  { fullName: "Administración de Empresas", abbreviation: "ADE", faculty: "Ciencias Económicas" },
  { fullName: "Economía", abbreviation: "ECO", faculty: "Ciencias Económicas" },
  
  // Facultad de Humanidades
  { fullName: "Derecho", abbreviation: "DER", faculty: "Humanidades" },
  { fullName: "Psicología", abbreviation: "PSI", faculty: "Humanidades" },
  { fullName: "Educación", abbreviation: "EDU", faculty: "Humanidades" },
  
  // Facultad de Ciencias
  { fullName: "Matemáticas", abbreviation: "MAT", faculty: "Ciencias" },
  { fullName: "Biología", abbreviation: "BIO", faculty: "Ciencias" },
]

// Ubicaciones (4-6 sedes)
export const locationsData: LocationSeed[] = [
  { name: "Sede Central" },
  { name: "Sede Norte" },
  { name: "Sede Sur" },
  { name: "Sede Este" },
  { name: "Sede Oeste" },
  { name: "Sede Centro" },
]

// Plazas para fase 1 (distribución variada por carrera-ubicación)
export const spotsData: SpotSeed[] = [
  // Medicina - Popular, más plazas
  { careerName: "Medicina", locationName: "Sede Central", availableQuantity: 8 },
  { careerName: "Medicina", locationName: "Sede Norte", availableQuantity: 5 },
  { careerName: "Medicina", locationName: "Sede Sur", availableQuantity: 4 },
  
  // Ingeniería Informática - Muy popular
  { careerName: "Ingeniería Informática", locationName: "Sede Central", availableQuantity: 10 },
  { careerName: "Ingeniería Informática", locationName: "Sede Norte", availableQuantity: 6 },
  { careerName: "Ingeniería Informática", locationName: "Sede Este", availableQuantity: 5 },
  
  // Derecho - Popular
  { careerName: "Derecho", locationName: "Sede Central", availableQuantity: 7 },
  { careerName: "Derecho", locationName: "Sede Sur", availableQuantity: 4 },
  
  // Contabilidad - Popular
  { careerName: "Contabilidad", locationName: "Sede Central", availableQuantity: 6 },
  { careerName: "Contabilidad", locationName: "Sede Norte", availableQuantity: 4 },
  { careerName: "Contabilidad", locationName: "Sede Este", availableQuantity: 3 },
  
  // Enfermería
  { careerName: "Enfermería", locationName: "Sede Central", availableQuantity: 5 },
  { careerName: "Enfermería", locationName: "Sede Sur", availableQuantity: 3 },
  
  // Ingeniería Civil
  { careerName: "Ingeniería Civil", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Ingeniería Civil", locationName: "Sede Norte", availableQuantity: 3 },
  
  // Administración de Empresas
  { careerName: "Administración de Empresas", locationName: "Sede Central", availableQuantity: 5 },
  { careerName: "Administración de Empresas", locationName: "Sede Este", availableQuantity: 3 },
  
  // Psicología
  { careerName: "Psicología", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Psicología", locationName: "Sede Oeste", availableQuantity: 3 },
  
  // Ingeniería Industrial
  { careerName: "Ingeniería Industrial", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Ingeniería Industrial", locationName: "Sede Norte", availableQuantity: 3 },
  
  // Farmacia
  { careerName: "Farmacia", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Farmacia", locationName: "Sede Sur", availableQuantity: 2 },
  
  // Educación
  { careerName: "Educación", locationName: "Sede Central", availableQuantity: 4 },
  { careerName: "Educación", locationName: "Sede Centro", availableQuantity: 3 },
  
  // Economía
  { careerName: "Economía", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Economía", locationName: "Sede Este", availableQuantity: 2 },
  
  // Ingeniería Eléctrica
  { careerName: "Ingeniería Eléctrica", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Ingeniería Eléctrica", locationName: "Sede Norte", availableQuantity: 2 },
  
  // Matemáticas
  { careerName: "Matemáticas", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Matemáticas", locationName: "Sede Centro", availableQuantity: 2 },
  
  // Biología
  { careerName: "Biología", locationName: "Sede Central", availableQuantity: 3 },
  { careerName: "Biología", locationName: "Sede Sur", availableQuantity: 2 },
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

// Generar CIs únicos
function generateCI(index: number): string {
  // Generar CI de 8-11 dígitos, asegurando unicidad
  const base = 10000000 + index
  return base.toString()
}

// Generar calificación con distribución normal
function generateGrade(index: number, total: number): number {
  // Distribución aproximada: 10% excelentes, 20% muy buenos, 40% buenos, 20% regulares, 10% bajas
  const percentile = index / total
  
  if (percentile < 0.1) {
    // Top 10%: 85-100
    return Math.round(85 + Math.random() * 15)
  } else if (percentile < 0.3) {
    // Siguiente 20%: 75-84
    return Math.round(75 + Math.random() * 9)
  } else if (percentile < 0.7) {
    // Siguiente 40%: 65-74
    return Math.round(65 + Math.random() * 9)
  } else if (percentile < 0.9) {
    // Siguiente 20%: 55-64
    return Math.round(55 + Math.random() * 9)
  } else {
    // Último 10%: 45-54
    return Math.round(45 + Math.random() * 9)
  }
}

// Generar número de solicitudes (1-3)
function generateRequestCount(): number {
  const rand = Math.random()
  // 20% con 1 solicitud, 50% con 2, 30% con 3
  if (rand < 0.2) return 1
  if (rand < 0.7) return 2
  return 3
}

// Generar aspirantes (80-120 aspirantes)
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
