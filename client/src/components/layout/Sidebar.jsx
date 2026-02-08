import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-purple-800 p-6 hidden md:flex flex-col">

      <h2 className="text-2xl font-bold text-purple-400 mb-10">
        Cosmic Watch
      </h2>

      <nav className="flex flex-col gap-6 text-gray-300">
        <Link to="/dashboard" className="hover:text-purple-400 transition">
          Dashboard
        </Link>

        <Link to="/watchlist" className="hover:text-purple-400 transition">
          Watchlist
        </Link>

        <Link to="/alerts" className="hover:text-purple-400 transition">
          Alerts
        </Link>

        <Link to="/" className="hover:text-red-400 transition mt-auto">
          Logout
        </Link>
      </nav>

    </div>
  )
}
