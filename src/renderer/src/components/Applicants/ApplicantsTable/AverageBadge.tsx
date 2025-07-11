import { Badge } from "@renderer/components/ui/badge"

interface AverageBadgeProps {
  value: number // entre 60.00 y 100.00
}

const AverageBadge = ({ value }: AverageBadgeProps) => {
  let className = ""

  if (value < 70) {
    className = "bg-white text-red-500 border border-red-500"
  } else if (value < 80) {
    className = " bg-white text-orange-500 border border-orange-500"
  } else if (value < 90) {
    className = " bg-white text-yellow-500 border border-yellow-500"
  } else if (value < 100) {
    className = " bg-white text-green-500 border border-green-500"
  } else {
    className = "" // usa el default del tema
  }

  return (
    <Badge className={className}>
      {value.toFixed(2)}
    </Badge>
  )
}

export default AverageBadge
