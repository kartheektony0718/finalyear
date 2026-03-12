import { useEffect, useState } from "react"
import API from "@/utils/api"

interface Interview {
  id: string
  jobDescription: string
}

const AdminInterviews = () => {

  const [interviews, setInterviews] = useState<Interview[]>([])

  useEffect(() => {

    const fetchInterviews = async () => {

      try {

        const res = await API.get("/admin/interviews")

        setInterviews(res.data)

      } catch (error) {

        console.log(error)

      }

    }

    fetchInterviews()

  }, [])

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Interviews
      </h1>

      {interviews.map((i) => (

        <div
          key={i.id}
          className="bg-slate-800 p-4 mb-3 rounded"
        >

          {i.jobDescription}

        </div>

      ))}

    </div>

  )

}

export default AdminInterviews