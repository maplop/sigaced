import SimpleCard from "@renderer/components/common/SimpleCard"
import { Users, ShieldCheck, Eye } from "lucide-react"
import { User } from "src/shared/types"

interface UsersStatisticsProps {
  users: User[]
}

const UsersStatistics = ({ users }: UsersStatisticsProps) => {
  const stats = [
    {
      title: "Usuarios totales",
      stat: users.length,
      icon: Users,
    },
    {
      title: "Administradores",
      stat: 12,
      icon: ShieldCheck,
    },
    {
      title: "Supervisores",
      stat: 24,
      icon: Eye,
    },
  ]


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((item, index) => (
        <SimpleCard
          key={index}
          title={item.title}
          value={item.stat}
          icon={item.icon}
        />
      ))}
    </div>
  )
}

export default UsersStatistics
