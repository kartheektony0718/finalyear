
import { useLocation } from "react-router-dom"
import { useState } from "react"

interface Module {
  title: string
  videoUrl: string
}

const AICoursePlayer = () => {

  const location = useLocation()

  const course = location.state

  const [currentModule, setCurrentModule] = useState(0)

  const modules:Module[] = course.modules

  return (

    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold text-red-500 mb-8">
        {course.title}
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {/* VIDEO PLAYER */}

        <div className="col-span-2">

          <div className="rounded-xl overflow-hidden border border-red-900">

            <iframe
              width="100%"
              height="420"
              src={modules[currentModule].videoUrl.replace("watch?v=", "embed/")}
              allowFullScreen
            />

          </div>

        </div>

        {/* MODULE LIST */}

        <div className="bg-[#0b0c12] p-6 rounded-xl border border-red-900">

          <h3 className="font-bold text-red-500 mb-4">
            Modules
          </h3>

          {modules.map((module,index)=>(

            <div
              key={index}
              onClick={()=>setCurrentModule(index)}
              className="p-3 mb-3 rounded-lg cursor-pointer bg-gray-800 hover:bg-red-700"
            >

              {index+1}. {module.title}

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}

export default AICoursePlayer