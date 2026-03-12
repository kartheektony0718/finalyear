import { Link, Outlet, useLocation } from "react-router-dom"

const AdminLayout = () => {

  const location = useLocation()

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Roadmaps", path: "/admin/roadmaps" },
    { name: "Interviews", path: "/admin/interviews" }
  ]

  return (

    <div className="flex min-h-screen bg-black text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0b0c12] border-r border-red-900 p-6">

        <h2 className="text-2xl font-bold text-red-500 mb-10">
          SkillNect Admin
        </h2>

        <nav className="flex flex-col gap-4">

          {menu.map((item) => (

            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded transition ${
                location.pathname === item.path
                  ? "bg-red-600 text-white"
                  : "hover:bg-red-900/40"
              }`}
            >
              {item.name}
            </Link>

          ))}

        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">

        <Outlet />

      </main>

    </div>

  )

}

export default AdminLayout