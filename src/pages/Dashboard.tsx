import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  BrainCircuit,
  FileText,
  Map,
  TrendingUp,
  Activity,
  ChevronRight,
  X,
  MessageSquare
} from "lucide-react"

import { useNavigate } from "react-router-dom"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"


type ChatMessage = {
  role: "interviewer" | "candidate" | "feedback"
  content: string
}

type InterviewSession = {
  id: string
  jobDescription: string
  transcript: ChatMessage[]
  createdAt: string
}

export default function Dashboard() {

  const navigate = useNavigate()

  const [history, setHistory] = useState<InterviewSession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null)


  /*
  FETCH INTERVIEW HISTORY
  */

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const token = localStorage.getItem("token")

const user = JSON.parse(localStorage.getItem("user") || "{}")

const res = await fetch(
 `${import.meta.env.VITE_API_URL}/api/interview/history/${user.id}`,
 {
   headers:{
     Authorization:`Bearer ${token}`
   }
 }
)

        if (res.ok) {

          const data = await res.json()

          setHistory(Array.isArray(data) ? data : [])

        }

      } catch (err) {

        console.log("History fetch failed")

      } finally {

        setLoading(false)

      }

    }

    fetchHistory()

  }, [])



  /*
  CALCULATE SCORE
  */

  const calculateAverageScore = (messages: ChatMessage[] = []) => {

    const feedback = messages.filter(m => m.role === "feedback")

    if (!feedback.length) return 0

    let total = 0
    let count = 0

    feedback.forEach(m => {

      const match = m.content.match(/(\d+)\s*\/\s*10/)

      if (match) {
        total += parseInt(match[1])
        count++
      }

    })

    return count ? Math.round(total / count) : 0

  }



  /*
  CHART DATA
  */

  const chartData = history
    .slice()
    .reverse()
    .map((session, i) => ({
      name: `Int ${i + 1}`,
      date: new Date(session.createdAt).toLocaleDateString(),
      score: calculateAverageScore(session.transcript)
    }))
    .filter(d => d.score > 0)



  /*
  STATS
  */

  const stats = {
    interviews: history.length,
    avgScore:
      history.length > 0
        ? Math.round(
            history.reduce((a, s) => a + calculateAverageScore(s.transcript), 0) /
              history.length
          )
        : 0
  }



  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl font-black uppercase italic tracking-tight text-white">
          Welcome Back
        </h1>

        <p className="text-xs text-primary uppercase tracking-[0.2em] mt-1">
          SkillNect Mission Control
        </p>

      </div>



      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <Card className="bg-card/40 backdrop-blur">

          <CardContent className="p-6 text-center">

            <h2 className="text-3xl font-bold text-primary">
              {stats.interviews}
            </h2>

            <p className="text-xs uppercase tracking-widest">
              Interviews Taken
            </p>

          </CardContent>

        </Card>


        <Card className="bg-card/40 backdrop-blur">

          <CardContent className="p-6 text-center">

            <h2 className="text-3xl font-bold text-primary">
              {stats.avgScore}/10
            </h2>

            <p className="text-xs uppercase tracking-widest">
              Average Score
            </p>

          </CardContent>

        </Card>


        <Card className="bg-card/40 backdrop-blur">

          <CardContent className="p-6 text-center">

            <h2 className="text-3xl font-bold text-primary">
              {chartData.length}
            </h2>

            <p className="text-xs uppercase tracking-widest">
              Scored Interviews
            </p>

          </CardContent>

        </Card>

      </div>



      {/* QUICK ACTIONS */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <Card className="border-primary/20 bg-card/40">

          <CardHeader>

            <BrainCircuit className="text-primary h-8 w-8 mb-2" />

            <CardTitle>AI Mock Interview</CardTitle>

          </CardHeader>

          <CardContent>

            <Button
              className="w-full bg-primary"
              onClick={() => navigate("/interview-prep")}
            >
              Start Interview
            </Button>

          </CardContent>

        </Card>



        <Card className="bg-card/40">

          <CardHeader>

            <FileText className="h-8 w-8 mb-2" />

            <CardTitle>Resume Builder</CardTitle>

          </CardHeader>

          <CardContent>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate("/resume-builder")}
            >
              Edit Resume
            </Button>

          </CardContent>

        </Card>



        <Card className="bg-card/40">

          <CardHeader>

            <Map className="text-primary h-8 w-8 mb-2" />

            <CardTitle>Career Roadmaps</CardTitle>

          </CardHeader>

          <CardContent>

            <Button
              className="w-full bg-primary"
              onClick={() => navigate("/roadmaps")}
            >
              View Roadmaps
            </Button>

          </CardContent>

        </Card>

      </div>



      {/* PERFORMANCE CHART */}

      {chartData.length > 0 && (

        <Card className="mb-10">

          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" />
              Performance Growth
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="h-[260px]">

              <ResponsiveContainer width="100%" height="100%">

                <LineChart data={chartData}>

                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

                  <XAxis dataKey="date" />

                  <YAxis domain={[0, 10]} />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#D2042D"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>

      )}



      {/* INTERVIEW HISTORY */}

      <div>

        <div className="flex items-center gap-2 mb-4">

          <Activity className="text-primary" />

          <h2 className="text-2xl font-bold uppercase italic">
            Mission History
          </h2>

        </div>


        {loading ? (

          <div className="text-center p-10 text-muted-foreground">
            Loading History...
          </div>

        ) : history.length === 0 ? (

          <Card className="text-center p-10">

            <MessageSquare className="mx-auto mb-4 opacity-20" />

            <p>No interview history yet</p>

          </Card>

        ) : (

          <div className="space-y-4">

            {history.map(session => (

              <Card
                key={session.id}
                className="cursor-pointer hover:bg-primary/5"
                onClick={() => setSelectedSession(session)}
              >

                <CardContent className="p-6 flex justify-between">

                  <div>

                    <p className="font-bold">
                      {session.jobDescription.slice(0, 60)}...
                    </p>

                    <p className="text-xs text-muted-foreground">

                      {new Date(session.createdAt).toLocaleDateString()}

                      {" • "}

                      Score: {calculateAverageScore(session.transcript)}/10

                    </p>

                  </div>

                  <ChevronRight />

                </CardContent>

              </Card>

            ))}

          </div>

        )}

      </div>



      {/* TRANSCRIPT MODAL */}

      {selectedSession && (

        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

          <div className="bg-[#0A0A0B] border border-primary/20 w-[800px] max-h-[80vh] overflow-y-auto rounded-xl">

            <div className="flex justify-between p-6 border-b border-white/10">

              <h3 className="font-bold uppercase">
                Interview Transcript
              </h3>

              <Button
                variant="ghost"
                onClick={() => setSelectedSession(null)}
              >
                <X />
              </Button>

            </div>

            <div className="p-6 space-y-6">

              {selectedSession.transcript.map((msg, i) => (

                <div
                  key={i}
                  className={`flex ${
                    msg.role === "candidate"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl max-w-[80%]">

                    <span className="text-[10px] uppercase opacity-50 block mb-2">
                      {msg.role}
                    </span>

                    {msg.content}

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>

  )

}