import { Card, CardTitle, CardContent } from "../ui/card"
import { LucideIcon } from "lucide-react"

interface SimpleCardProps {
  title: string
  value: number | string
  description: string
  icon: LucideIcon
}

const SimpleCard = ({ title, value, description, icon: Icon }: SimpleCardProps) => {
  return (
    <Card className="p-5">
      <CardContent className="flex flex-col p-0">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
export default SimpleCard
