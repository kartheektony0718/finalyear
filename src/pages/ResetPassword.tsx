import { useState } from "react"
import axios from "axios"
import { useParams,useNavigate } from "react-router-dom"
import { toast } from "sonner"

const ResetPassword = () => {

  const { token } = useParams()

  const navigate = useNavigate()

  const [password,setPassword] = useState("")

  const handleSubmit = async (e:any) => {

    e.preventDefault()

    try{

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
        { password }
      )

      toast.success("Password updated")

      navigate("/auth")

    }
    catch(err){

      toast.error("Invalid or expired token")

    }

  }

  return(

    <div className="min-h-screen flex items-center justify-center text-white">

      <form
        onSubmit={handleSubmit}
        className="bg-[#0b0c12] border border-red-900 p-8 rounded-xl w-[400px]"
      >

        <h1 className="text-2xl font-bold mb-6 text-red-500">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-3 bg-slate-800 rounded mb-4"
        />

        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded w-full"
        >
          Update Password
        </button>

      </form>

    </div>

  )

}

export default ResetPassword