import { useEffect, useState } from "react"
import API from "@/utils/api"

interface User {
  id: string
  name: string
  email: string
  role: string
}

const AdminUsers = () => {

  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {

    try {

      const res = await API.get("/admin/users")

      setUsers(res.data)

    } catch (error) {

      console.log(error)

    }

  }

  const deleteUser = async (id: string) => {

    try {

      await API.delete(`/admin/user/${id}`)

      fetchUsers()

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    fetchUsers()

  }, [])

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Users
      </h1>

      {users.map((user) => (

        <div
          key={user.id}
          className="bg-slate-800 p-4 mb-3 flex justify-between rounded"
        >

          <div>

            <p>{user.name}</p>
            <p className="text-gray-400">{user.email}</p>

          </div>

          <button
            onClick={() => deleteUser(user.id)}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Delete
          </button>

        </div>

      ))}

    </div>

  )

}

export default AdminUsers