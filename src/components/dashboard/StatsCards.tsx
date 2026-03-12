import { Card } from "@/components/ui/card"

type Stats = {
  interviews: number
  roadmaps: number
  courses: number
  certificates: number
}

export default function StatsCards({ stats }: { stats?: Stats }) {

  const safeStats = stats || {
    interviews: 0,
    roadmaps: 0,
    courses: 0,
    certificates: 0
  }

  return (

    <div className="grid grid-cols-4 gap-6">

      <Card className="p-6 text-center">
        <h3 className="text-2xl font-bold">{safeStats.interviews}</h3>
        <p className="text-xs uppercase">Interviews</p>
      </Card>

      <Card className="p-6 text-center">
        <h3 className="text-2xl font-bold">{safeStats.roadmaps}</h3>
        <p className="text-xs uppercase">Roadmaps</p>
      </Card>

      <Card className="p-6 text-center">
        <h3 className="text-2xl font-bold">{safeStats.courses}</h3>
        <p className="text-xs uppercase">AI Courses</p>
      </Card>

      <Card className="p-6 text-center">
        <h3 className="text-2xl font-bold">{safeStats.certificates}</h3>
        <p className="text-xs uppercase">Certificates</p>
      </Card>

    </div>

  )

}