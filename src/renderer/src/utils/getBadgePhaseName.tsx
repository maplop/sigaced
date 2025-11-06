import { Badge } from "@renderer/components/ui/badge"

export const getBadgePhaseName = (phaseId: number) => {
  switch (phaseId) {
    case 1:
      return <Badge variant={"secondary"} className="bg-blue-100 text-blue-900">Primer Otorgamiento</Badge>
    case 2:
      return <Badge variant={"secondary"} className="bg-green-200 text-green-700">Segundo Otorgamiento</Badge>
    case 3:
      return <Badge variant={"secondary"} className="bg-yellow-100 text-yellow-700">Otorgamiento Manual</Badge>
    default:
      return phaseId
  }
}
