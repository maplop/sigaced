import { Trophy } from "lucide-react"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { TopStudent } from "src/shared/types"

interface TopStudentsProps {
  topStudents?: TopStudent[],
  loadingTopStudents: boolean
}

export function TopStudents({ topStudents, loadingTopStudents }: TopStudentsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-foreground">Top 5 Estudiantes</h3>
          </div>
          <div className="space-y-3">
            {topStudents?.map((student, index) => (
              <div key={student.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{student.lastName} {student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.career}</p>
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
