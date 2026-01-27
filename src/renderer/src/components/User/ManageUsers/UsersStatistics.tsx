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
      stat: users.reduce((totalAdmin, user) => {
        return user.role === "admin" ? totalAdmin + 1 : totalAdmin
      }, 0),
      icon: ShieldCheck,
    },
    {
      title: "Supervisores",
      stat: users.reduce((totalViewer, user) => {
        return user.role === 'viewer' ? totalViewer + 1 : totalViewer
      }, 0),
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
