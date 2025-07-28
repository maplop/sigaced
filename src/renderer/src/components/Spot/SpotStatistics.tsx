import SimpleCard from "@renderer/components/common/SimpleCard"
import { Users, GraduationCap, Calendar, TrendingUp } from "lucide-react"

const SpotStatistics = () => {

  const statsData = [
    {
      title: 'Total Aspirantes',
      stat: 20,
      text: 'Registrados en el sistema',
      icon: Users
    },
    {
      title: 'Aprobados',
      stat: 13,
      text: `${((13 / 20) * 100).toFixed(1)}% del total`,
      icon: GraduationCap
    },
    {
      title: 'Pendientes',
      stat: 7,
      text: 'En proceso de evaluación',
      icon: Calendar
    },
    {
      title: 'Promedio General',
      stat: 92,
      text: 'Calificación promedio',
      icon: TrendingUp
    },

  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((item, index) => (
        <SimpleCard
          key={index}
          title={item.title}
          value={item.stat}
          description={item.text}
          icon={item.icon}
        />
      ))}
    </div>
  )
}
export default SpotStatistics
