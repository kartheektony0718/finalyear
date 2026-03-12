import { useState, useEffect } from "react"
import axios from "axios"

interface Module {
  title: string
  videoUrl: string
}

interface Roadmap {
  id: string
  title: string
}

const AdminRoadmaps = () => {

  const [title, setTitle] = useState("")
  const [modules, setModules] = useState<Module[]>([])
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])

  const fetchRoadmaps = async () => {

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/roadmaps`)

    setRoadmaps(res.data)

  }

  useEffect(() => {

    fetchRoadmaps()

  }, [])

  const addModule = () => {

    setModules([...modules, { title: "", videoUrl: "" }])

  }

  const updateModule = (index: number, field: string, value: string) => {

    const updated = [...modules]

    updated[index] = {
      ...updated[index],
      [field]: value
    }

    setModules(updated)

  }

  const createRoadmap = async () => {

    await axios.post(`${import.meta.env.VITE_API_URL}/api/roadmaps/create`, {

      title,
      modules

    })

    setTitle("")
    setModules([])

    fetchRoadmaps()

  }

  return (

    <div className="p-10 text-white">

      <h1 className="text-3xl mb-6">
        Admin Roadmaps
      </h1>

      {/* ROADMAP TITLE */}

      <input
        className="bg-gray-800 p-2 rounded w-full mb-4"
        placeholder="Roadmap Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* MODULES */}

      {modules.map((module, index) => (

        <div key={index} className="mb-4">

          <input
            placeholder="Module Title"
            className="bg-gray-800 p-2 rounded w-full mb-2"
            value={module.title}
            onChange={(e) =>
              updateModule(index, "title", e.target.value)
            }
          />

          <input
            placeholder="Youtube URL"
            className="bg-gray-800 p-2 rounded w-full"
            value={module.videoUrl}
            onChange={(e) =>
              updateModule(index, "videoUrl", e.target.value)
            }
          />

        </div>

      ))}

      <button
        onClick={addModule}
        className="bg-blue-600 px-4 py-2 rounded mr-4"
      >
        Add Module
      </button>

      <button
        onClick={createRoadmap}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Save Roadmap
      </button>

      {/* EXISTING ROADMAPS */}

      <div className="mt-10">

        {roadmaps.map((r) => (

          <div
            key={r.id}
            className="bg-gray-900 p-4 rounded mb-3"
          >
            {r.title}
          </div>

        ))}

      </div>

    </div>

  )

}

export default AdminRoadmaps