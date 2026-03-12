import { useState } from "react"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"
import { Zap, Save, Loader } from "lucide-react"

interface Module {
  title: string
  videoUrl: string
}

interface Roadmap {
  title: string
  modules: Module[]
}

const AIRoadmap = () => {

  const { user } = useAuth()

  const [skill, setSkill] = useState("")
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  /*
  ========================
  GENERATE ROADMAP
  ========================
  */

  const generateRoadmap = async () => {

    try {

      setLoading(true)

      const res = await axios.post(
        "http://localhost:5000/api/ai/generate-roadmap",
        { skill }
      )

      setRoadmap(res.data)

      setLoading(false)

    } catch (error) {

      console.log(error)
      setLoading(false)

    }

  }

  /*
  ========================
  SAVE COURSE
  ========================
  */

  const saveRoadmap = async () => {

  if (!roadmap) return;

  try {

    setSaving(true);

    const res = await axios.post(
      "http://localhost:5000/api/ai/save",
      {
        userId: user?.id,
        title: roadmap.title,
        modules: roadmap.modules
      }
    );

    alert(res.data.message);

  } catch (error) {

    console.log(error);

  }

  setSaving(false);

};
  return (

    <div className="p-10 text-white max-w-6xl mx-auto">

      {/* HEADER */}

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-red-500 mb-10"
      >
        AI Learning Roadmap
      </motion.h1>

      {/* INPUT BOX */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 mb-10"
      >

        <input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="What do you want to learn? (ex: Machine Learning)"
          className="p-4 bg-[#0b0c12] border border-red-900 rounded-lg w-[350px] outline-none focus:border-red-600"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateRoadmap}
          className="flex items-center gap-2 bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700"
        >
          <Zap size={18} />
          Generate
        </motion.button>

      </motion.div>

      {/* LOADING */}

      {loading && (

        <div className="flex items-center gap-3 text-gray-400">

          <Loader className="animate-spin" />

          Generating AI roadmap...

        </div>

      )}

      {/* ROADMAP */}

      {roadmap && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >

          <h2 className="text-3xl font-bold mb-10 text-red-400">
            {roadmap.title}
          </h2>

          {/* MODULES */}

          <div className="grid gap-10">

            {roadmap.modules.map((module, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0b0c12] border border-red-900 p-6 rounded-xl shadow-lg"
              >

                <h3 className="text-xl font-bold mb-4 text-red-400">
                  {index + 1}. {module.title}
                </h3>

                <div className="rounded-lg overflow-hidden border border-red-800">

                  <iframe
                    width="100%"
                    height="400"
                    src={module.videoUrl.replace("watch?v=", "embed/")}
                    allowFullScreen
                  />

                </div>

              </motion.div>

            ))}

          </div>

          {/* SAVE BUTTON */}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveRoadmap}
            disabled={saving}
            className="mt-10 flex items-center gap-2 bg-green-600 px-8 py-3 rounded-lg hover:bg-green-700"
          >

            <Save size={18} />

            {saving ? "Saving Course..." : "Save Course"}

          </motion.button>

        </motion.div>

      )}

    </div>

  )

}

export default AIRoadmap