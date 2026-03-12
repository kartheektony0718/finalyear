import { useState, useRef, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { 
  Mic, Square, Send, Loader2, User, Bot, 
  Sparkles, FileText, Briefcase, Volume2, VolumeX 
} from "lucide-react"
import { useNavigate } from "react-router-dom"
type Message = {
  role: "interviewer" | "candidate" | "feedback"
  content: string
}

export default function InterviewPrep() {
  const navigate = useNavigate()
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [answer, setAnswer] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false) // New Mute State

  const recognitionRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return
    
    // Always stop existing speech first
    window.speechSynthesis.cancel()

    // If muted, we don't proceed to speak
    if (isMuted) return

    const speech = new SpeechSynthesisUtterance(text)
    speech.rate = 0.95
    speech.lang = "en-US"
    window.speechSynthesis.speak(speech)
  }

  // Toggle Mute Handler
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMutedState = !prev
      if (newMutedState) {
        window.speechSynthesis.cancel() // Stop talking immediately if muting
      }
      return newMutedState
    })
  }

  const startInterview = async () => {
    if (!resumeText || !jobDescription) {
      toast.error("Provide resume and job description")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      })
      const data = await res.json()
      setMessages([{ role: "interviewer", content: data.question }])
      speakText(data.question)
      setStarted(true)
    } finally {
      setLoading(false)
    }
  }

  const sendAnswer = async () => {
    if (!answer) return
    const question = messages.filter(m => m.role === "interviewer").pop()?.content || ""
    const candidateAnswer = answer
    setMessages(prev => [...prev, { role: "candidate", content: candidateAnswer }])
    setAnswer("")
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer: candidateAnswer, jobDescription })
      })
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        { role: "feedback", content: `Score: ${data.score}/10\n\n${data.feedback}` },
        { role: "interviewer", content: data.nextQuestion }
      ])
      speakText(data.nextQuestion)
    } finally {
      setLoading(false)
    }
  }

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.onresult = (event: any) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setAnswer(prev => prev + transcript)
    }
    recognition.start()
    recognitionRef.current = recognition
    setIsRecording(true)
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  const endInterview = async () => {

  try {

    const token = localStorage.getItem("token")

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const res = await fetch(
      "http://localhost:5000/api/interview/save",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        },
        body:JSON.stringify({
          userId:user.id,
          jobDescription,
          transcript:messages
        })
      }
    )

    if(res.ok){

      toast.success("Interview saved!")

      navigate("/interview-history")

    }else{

      toast.error("Failed to save interview")

    }

  }catch(error){

    toast.error("Server error")

  }

}

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 p-6">
        {!started ? (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight">Mock Interview AI</h1>
              <p className="text-slate-500 max-w-lg mx-auto">Master your interview skills with real-time AI feedback.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Resume Content</span>
                </div>
                <Textarea
                  placeholder="Paste your professional experience..."
                  className="min-h-[300px] shadow-sm rounded-xl"
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  <span>Job Description</span>
                </div>
                <Textarea
                  placeholder="Paste the target job requirements..."
                  className="min-h-[300px] shadow-sm rounded-xl"
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button size="lg" className="px-12 py-6 text-lg rounded-full" onClick={startInterview} disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Initialize Interview
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[85vh] bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-2xl">
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 h-2.5 w-2.5 rounded-full animate-pulse" />
                  <span className="font-bold text-slate-700">Live Session</span>
                </div>
                {/* Mute Toggle Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleMute}
                  className={`flex gap-2 items-center ${isMuted ? 'text-red-500 hover:text-red-600' : 'text-slate-600'}`}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span className="text-xs font-semibold">{isMuted ? "Muted" : "Voice On"}</span>
                </Button>
              </div>
              <div className="flex items-center gap-4">
                {isRecording && <Badge variant="destructive" className="animate-bounce">Mic Active</Badge>}
                <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>Exit Session</Button>
              </div>
            </header>

            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-5 rounded-2xl shadow-sm ${
                      msg.role === "candidate" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : msg.role === "feedback"
                        ? "bg-amber-100 border-l-4 border-amber-500 text-amber-900 italic rounded-none"
                        : "bg-white text-slate-800 rounded-bl-none border border-slate-200"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {msg.role === "interviewer" ? <Bot size={16} /> : msg.role === "candidate" ? <User size={16} /> : <Sparkles size={16} />}
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{msg.role}</span>
                      </div>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <footer className="bg-white border-t p-6">
              <div className="max-w-3xl mx-auto space-y-4">
                <Textarea
                  placeholder="Draft your answer here..."
                  className="min-h-[100px] rounded-xl border-slate-200 resize-none shadow-inner"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                />
                <div className="flex gap-3">
                  <Button className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg" onClick={sendAnswer} disabled={loading || !answer}>
                    <Send className="w-4 h-4 mr-2" /> Submit Response
                  </Button>
                  <div className="flex gap-4 mt-4">

  <Button onClick={sendAnswer}>
    Submit Answer
  </Button>

  <Button
    onClick={startRecording}
    variant="outline"
  >
    🎤 Speak
  </Button>

  <Button
    onClick={stopRecording}
    variant="outline"
  >
    Stop
  </Button>

  <Button
    onClick={endInterview}
    variant="destructive"
  >
    End Interview
  </Button>

</div>
                  {!isRecording ? (
                    <Button variant="outline" className="h-12 w-12 rounded-xl" onClick={startRecording}>
                      <Mic className="w-5 h-5 text-slate-600" />
                    </Button>
                  ) : (
                    <Button variant="destructive" className="h-12 w-12 rounded-xl" onClick={stopRecording}>
                      <Square className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </footer>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}