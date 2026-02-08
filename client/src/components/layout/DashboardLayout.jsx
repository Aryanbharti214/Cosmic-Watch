import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

import StatsCard from "../components/ui/StatsCard"


export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-purple-950">
          {children}
        </main>

      </div>
    </div>
  )
}
