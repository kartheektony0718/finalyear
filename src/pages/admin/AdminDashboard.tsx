import { useEffect, useState } from "react"
import API from "@/utils/api"

interface Stats {
  users: number
  interviews: number
  roadmaps: number
}

const AdminDashboard = () => {

  const [stats, setStats] = useState<Stats>({
    users: 0,
    interviews: 0,
    roadmaps: 0
  })

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res = await API.get("/admin/stats")

        setStats(res.data)

      } catch (error) {

        console.log(error)

      }

    }

    fetchStats()

  }, [])

  return (

    <div>

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-gray-400">Users</p>
          <h2 className="text-3xl">{stats.users}</h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-gray-400">Interviews</p>
          <h2 className="text-3xl">{stats.interviews}</h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <p className="text-gray-400">Roadmaps</p>
          <h2 className="text-3xl">{stats.roadmaps}</h2>
        </div>

      </div>

    </div>

  )

}

export default AdminDashboard