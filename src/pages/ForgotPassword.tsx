import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"

const ForgotPassword = () => {

  const [email,setEmail] = useState("")

  const handleSubmit = async (e:any) => {

    e.preventDefault()

    try{

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      )

      toast.success("Reset token generated. Check backend console.")

    }
    catch(err){

      toast.error("User not found")

    }

  }

  return(

    <div className="min-h-screen flex items-center justify-center text-white">

      <form
        onSubmit={handleSubmit}
        className="bg-[#0b0c12] border border-red-900 p-8 rounded-xl w-[400px]"
      >

        <h1 className="text-2xl font-bold mb-6 text-red-500">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-3 bg-slate-800 rounded mb-4"
        />

        <button
          type="submit"
          className="bg-red-600 px-4 py-2 rounded w-full"
        >
          Send Reset Link
        </button>

      </form>

    </div>

  )

}

export default ForgotPassword