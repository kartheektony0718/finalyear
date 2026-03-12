import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import Certificate from "@/components/Certificate";

interface Module {
  title: string;
  videoUrl: string;
}

interface Roadmap {
  _id: string;
  title: string;
  modules: Module[];
}

const Roadmaps = () => {

  const { user } = useAuth();

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);

  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  /*
  FETCH ROADMAPS
  */

  const fetchRoadmaps = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/roadmaps`
      );

      setRoadmaps(res.data);

    } catch (err) {
      console.log(err);
    }

  };

  /*
  START ROADMAP + LOAD SAVED PROGRESS
  */

  const startRoadmap = async (roadmap: Roadmap) => {

    setActiveRoadmap(roadmap);

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/progress/${user?.id}/${roadmap._id}`
      );

      const completed = res.data.completedModules || 0;

      setCompletedModules(completed);

      if (completed >= roadmap.modules.length) {
        setCurrentModule(roadmap.modules.length - 1);
      } else {
        setCurrentModule(completed);
      }

    } catch {

      setCompletedModules(0);
      setCurrentModule(0);

    }

  };

  /*
  SAVE PROGRESS + NEXT MODULE
  */

  const markComplete = async () => {

    if (!activeRoadmap) return;

    const next = currentModule + 1;

    setCompletedModules(next);

    try {

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/progress/update`,
        {
          userId: user?.id,
          roadmapId: activeRoadmap._id,
          completedModules: next
        }
      );

      /*
      CREATE CERTIFICATE WHEN FINISHED
      */

      if (next === activeRoadmap.modules.length) {

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/certificates/create`,
          {
            userId: user?.id,
            course: activeRoadmap.title
          }
        );

      }

    } catch (err) {
      console.log(err);
    }

    if (next < activeRoadmap.modules.length) {
      setCurrentModule(next);
    }

  };

  /*
  SELECT MODULE
  */

  const selectModule = (index: number) => {

    if (index <= completedModules) {
      setCurrentModule(index);
    }

  };

  /*
  CONVERT YOUTUBE URL
  */

  const getYoutubeEmbedUrl = (url: string) => {

    if (!url) return "";

    let videoId = "";

    if (url.includes("youtube.com/watch")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    }

    if (url.includes("youtu.be")) {
      videoId = url.split("/").pop() || "";
    }

    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1`;
  };

  /*
  CALCULATE PROGRESS
  */

  const progress =
    activeRoadmap
      ? Math.round(
          (completedModules / activeRoadmap.modules.length) * 100
        )
      : 0;

  return (

    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold text-red-500 mb-8">
        Career Roadmaps
      </h1>

      {/* ROADMAP LIST */}

      {!activeRoadmap && (

        <div className="grid grid-cols-3 gap-6">

          {roadmaps.map((roadmap) => (

            <div
              key={roadmap._id}
              className="bg-[#0b0c12] border border-red-900 p-6 rounded-xl hover:border-red-600 transition"
            >

              <h2 className="text-xl font-bold mb-4">
                {roadmap.title}
              </h2>

              <p className="text-gray-400 mb-6">
                {roadmap.modules.length} Modules
              </p>

              <button
                onClick={() => startRoadmap(roadmap)}
                className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Start Learning
              </button>

            </div>

          ))}

        </div>

      )}

      {/* ROADMAP PLAYER */}

      {activeRoadmap && (

        <div>

          <h2 className="text-2xl font-bold text-red-500 mb-4">
            {activeRoadmap.title}
          </h2>

          {/* PROGRESS BAR */}

          <div className="mb-6">

            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-red-600"
                style={{ width: `${progress}%` }}
              />

            </div>

            <p className="text-sm mt-1">
              {progress}% Completed
            </p>

            {progress === 100 && (
              <div className="mt-4 bg-green-700 px-4 py-3 rounded-lg">
                🎉 You have completed this roadmap!
              </div>
            )}

          </div>

          <div className="grid grid-cols-3 gap-8">

            {/* VIDEO PLAYER */}

            <div className="col-span-2">

              <div className="rounded-xl overflow-hidden border border-red-900">

                <iframe
                  width="100%"
                  height="420"
                  src={getYoutubeEmbedUrl(
                    activeRoadmap.modules[
                      Math.min(currentModule, activeRoadmap.modules.length - 1)
                    ].videoUrl
                  )}
                  title="Roadmap Lesson"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl"
                />

              </div>

              <div className="flex gap-4 mt-4">

                <button
                  onClick={markComplete}
                  disabled={progress === 100}
                  className={`px-5 py-2 rounded-lg ${
                    progress === 100
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {progress === 100
                    ? "Roadmap Finished"
                    : "Next Lesson"}
                </button>

              </div>

            </div>

            {/* MODULE LIST */}

            <div className="bg-[#0b0c12] p-6 rounded-xl border border-red-900">

              <h3 className="font-bold text-red-500 mb-4">
                Modules
              </h3>

              {activeRoadmap.modules.map((module, index) => (

                <div
                  key={index}
                  onClick={() => selectModule(index)}
                  className={`p-3 mb-3 rounded-lg cursor-pointer ${
                    index <= completedModules
                      ? "bg-red-700"
                      : "bg-gray-800"
                  }`}
                >

                  {index + 1}. {module.title}

                  {index > completedModules && (
                    <span className="ml-2 text-gray-400">🔒</span>
                  )}

                </div>

              ))}

            </div>

          </div>

          {/* CERTIFICATE */}

          {progress === 100 && activeRoadmap && (

            <div className="mt-12">

              <Certificate
                name={user?.name || "Student"}
                course={activeRoadmap.title}
              />

            </div>

          )}

        </div>

      )}

    </div>

  );

};

export default Roadmaps;