import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
interface Module {
  title: string
  videoUrl: string
}

interface Course {
  id: string
  title: string
  modules: Module[]
}

const MyAICourses = () => {

  const { user } = useAuth()
const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  /*
  ==========================
  FETCH COURSES
  ==========================
  */

  const fetchCourses = async (userId:string) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/ai/${userId}`
      )

      setCourses(res.data)

    } catch (error) {

      console.log("Fetch error:", error)

    }

    setLoading(false)

  }

  /*
  ==========================
  LOAD WHEN USER READY
  ==========================
  */

  useEffect(() => {

    if(user?.id){

      fetchCourses(user.id)

    }

  }, [user])

  return (

    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold text-red-500 mb-8">
        My AI Courses
      </h1>

      {loading && (
        <p className="text-gray-400">
          Loading courses...
        </p>
      )}

      {!loading && courses.length === 0 && (
        <p className="text-gray-400">
          No saved AI courses yet
        </p>
      )}

      <div className="grid grid-cols-3 gap-6">

        {courses.map((course) => (

          <div
            key={course.id}
            className="bg-[#0b0c12] border border-red-900 p-6 rounded-xl hover:border-red-600 transition"
          >

            <h2 className="text-xl font-bold mb-4">
              {course.title}
            </h2>

            <p className="text-gray-400 mb-4">
              {course.modules.length} Modules
            </p>

          <button
  onClick={()=>navigate("/ai-course-player",{state:course})}
  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
>
  Open Course
</button>

          </div>

        ))}

      </div>

    </div>

  )

}

export default MyAICourses