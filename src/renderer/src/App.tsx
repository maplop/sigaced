/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { Location, Phase, Student, User } from 'src/shared/types'

function App(): React.JSX.Element {
  const [students, setStudents] = useState<Student[]>([])
  const [locations, setLoacations] = useState<Location[]>([])
  const [phases, setPhases] = useState<Phase[]>([])
  const [users, setUsers] = useState<User[]>([])



  // Cargar estudiantes al montar el componente
  useEffect(() => {
    window.api.getStudents().then((data: Student[]) => {
      console.log("Estudiantes --- ", data)
      setStudents(data)
    }).catch(err => {
      console.error('Error al cargar estudiantes:', err)
    })
    window.api.getLocations().then((data: Location[]) => {
      console.log("Estudiantes --- ", data)
      setLoacations(data)
    }).catch(err => {
      console.error('Error al cargar locations:', err)
    })
    window.api.getPhases().then((data: Phase[]) => {
      console.log("Estudiantes --- ", data)
      setPhases(data)
    }).catch(err => {
      console.error('Error al cargar phases:', err)
    })
    window.api.getUsers().then((data: User[]) => {
      console.log("Estudiantes --- ", data)
      setUsers(data)
    }).catch(err => {
      console.error('Error al cargar users:', err)
    })
  }, [])

  return (
    <div className="p-4 space-y-6">
      <section>
        <h2 className="text-lg font-bold">Estudiantes</h2>
        <ul className="list-disc list-inside">
          {students.map((student) => (
            <li key={student.ci}>
              {student.firstName} {student.firstLastName} ({student.ci}) - Nota: {student.grade}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold">Ubicaciones</h2>
        <ul className="list-disc list-inside">
          {locations.map((location) => (
            <li key={location.id}>{location.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold">Fases</h2>
        <ul className="list-disc list-inside">
          {phases.map((phase) => (
            <li key={phase.id}>{phase.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold">Usuarios</h2>
        <ul className="list-disc list-inside">
          {users.map((user) => (
            <li key={user.id}>
              {user.username} ({user.role})
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App
