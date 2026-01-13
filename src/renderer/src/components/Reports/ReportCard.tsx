import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface ReportCardProps {
  title: string
  description: string
  icon: React.ReactNode
  handleGenerateReport: () => void
}

export function ReportCard({ title, description, icon, handleGenerateReport }: ReportCardProps) {

  return (
    <Card className="group border hover:border-primary/20 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-primary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={handleGenerateReport}>Generar Reporte</Button>
      </CardContent>
    </Card>
  )
}
