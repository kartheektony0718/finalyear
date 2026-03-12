import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "react-router-dom"
export default function InterviewHistory(){

  const { user } = useAuth()

  const [interviews,setInterviews] = useState<any[]>([])

  useEffect(()=>{

    fetch(
      "http://localhost:5000/api/interview/history/"+user?.id
    )
      .then(res=>res.json())
      .then(data=>setInterviews(data))

  },[])

  return(

    <DashboardLayout>

      <div className="p-8">

        <h1 className="text-3xl font-bold mb-6">
        Interview History
        </h1>

        {interviews.map((i)=>(
  <div key={i.id} className="border p-4 mb-4 rounded">

    <p>
      Job Description: {i.jobDescription}
    </p>

    <p>
      Date: {new Date(i.createdAt).toLocaleDateString()}
    </p>

    <Link to={`/interview-report/${i.id}`}>

      <button className="mt-3 bg-red-600 px-4 py-2 rounded">
        View Interview
      </button>

    </Link>

  </div>
))}

      </div>

    </DashboardLayout>

  )

}