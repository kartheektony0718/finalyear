import { Link } from "react-router-dom"

export default function QuickActions(){

return(

<div className="grid grid-cols-4 gap-4">

<Link to="/interview-prep">
<button className="bg-red-600 p-4 rounded">
Start AI Interview
</button>
</Link>

<Link to="/ai-roadmaps">
<button className="bg-red-600 p-4 rounded">
Generate Roadmap
</button>
</Link>

<Link to="/resume-builder">
<button className="bg-red-600 p-4 rounded">
Build Resume
</button>
</Link>

<Link to="/certificate">
<button className="bg-red-600 p-4 rounded">
Certificates
</button>
</Link>

</div>

)

}