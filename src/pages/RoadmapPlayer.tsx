import { useState } from "react";

interface Module {
  title:string
  videoUrl:string
}

const RoadmapPlayer = ({modules}:{modules:Module[]}) => {

  const [current,setCurrent] = useState(0)

  const nextModule = () => {
    setCurrent(current+1)
  }

  return (

    <div>

      <h1>Learning Modules</h1>

      <iframe
        width="800"
        height="400"
        src={modules[current].videoUrl}
      />

      <button onClick={nextModule}>
        Mark Complete
      </button>

      <ul>

        {modules.map((m,index)=>(
          <li key={index}>

            {index<=current ? "Unlocked" : "Locked"} - {m.title}

          </li>
        ))}

      </ul>

    </div>

  )

}

export default RoadmapPlayer