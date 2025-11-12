import { Trophy } from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { TopStudent } from "src/shared/types"

interface TopStudentsProps {
  topStudents?: TopStudent[]
  loadingTopStudents: boolean
}

export function TopStudents({ topStudents, loadingTopStudents }: TopStudentsProps) {

  if (loadingTopStudents) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-foreground">Top 5 Estudiantes</h3>
        </div>
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-50 rounded" />
                    <Skeleton className="h-3 w-30 rounded" />
                  </div>
                </div>
                <Skeleton className="h-6 w-12 rounded" />
              </div>
            ))}
        </div>
      </Card>
    )
  }

  if (!topStudents || topStudents.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-orange-500" />

          <h3 className="text-lg font-semibold text-foreground">Top 5 Estudiantes</h3>
        </div>

        <div className="flex flex-col justify-center items-center text-center min-h-[250px]">
          <p className="text-sm text-muted-foreground font-medium">
            No hay estudiantes registrados
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-foreground">Top 5 Estudiantes</h3>
          </div>
          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <div key={student.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{student.lastName} {student.name}</p>
                    {student.career ? (
                      <p className="text-xs font-medium text-gray-900">{student.career}</p>
                    ) : (
                      <p className="text-xs italic text-gray-500">
                        Pendiente a asignación
                      </p>
                    )}
                  </div>
                </div>
                <Badge className="text-white">
                  {student.grade.toFixed(2)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
