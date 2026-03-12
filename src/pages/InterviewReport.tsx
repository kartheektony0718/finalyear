import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import DashboardLayout from "@/components/DashboardLayout"

type Message = {
  role: "interviewer" | "candidate" | "feedback"
  content: string
}

export default function InterviewReport(){

  const { id } = useParams()

  const [messages,setMessages] = useState<Message[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    fetch(
      `http://localhost:5000/api/interview/report/${id}`
    )
      .then(res=>res.json())
      .then(data=>{

        setMessages(data.transcript)

        setLoading(false)

      })

  },[])

  if(loading){
    return(
      <DashboardLayout>
        <p className="p-8">Loading interview...</p>
      </DashboardLayout>
    )
  }

  return(

    <DashboardLayout>

      <div className="p-8">

        <h1 className="text-3xl font-bold mb-6">
          Interview Report
        </h1>

        <div className="space-y-6">

          {messages.map((msg,index)=>{

            if(msg.role==="interviewer"){

              return(
                <div key={index} className="bg-blue-900 p-4 rounded">
                  <b>Question</b>
                  <p>{msg.content}</p>
                </div>
              )

            }

            if(msg.role==="candidate"){

              return(
                <div key={index} className="bg-green-900 p-4 rounded">
                  <b>Your Answer</b>
                  <p>{msg.content}</p>
                </div>
              )

            }

            if(msg.role==="feedback"){

              return(
                <div key={index} className="bg-purple-900 p-4 rounded">
                  <b>AI Feedback</b>
                  <p>{msg.content}</p>
                </div>
              )

            }

          })}

        </div>

      </div>

    </DashboardLayout>

  )

}