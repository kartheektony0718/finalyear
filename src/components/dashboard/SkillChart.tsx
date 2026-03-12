import { Card } from "@/components/ui/card"

export default function StatsCards({stats}:any){

return(

<div className="grid grid-cols-4 gap-6">

<Card className="p-6 text-center">
<h3 className="text-xl font-bold">{stats.interviews}</h3>
<p>AI Interviews</p>
</Card>

<Card className="p-6 text-center">
<h3 className="text-xl font-bold">{stats.roadmaps}</h3>
<p>Roadmaps</p>
</Card>

<Card className="p-6 text-center">
<h3 className="text-xl font-bold">{stats.courses}</h3>
<p>AI Courses</p>
</Card>

<Card className="p-6 text-center">
<h3 className="text-xl font-bold">{stats.certificates}</h3>
<p>Certificates</p>
</Card>

</div>

)

}