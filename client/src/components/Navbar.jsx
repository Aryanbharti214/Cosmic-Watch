import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Navbar({ onSearch, onFilter }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("ALL")
  const navigate = useNavigate()

  const handleSearchChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const handleFilterChange = (e) => {
    const value = e.target.value
    setFilter(value)
    onFilter(value)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-xl border-b border-purple-900">

      {/* Logo */}
      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Cosmic Watch
      </h1>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">

        <input
          type="text"
          placeholder="Search asteroid..."
          value={query}
          onChange={handleSearchChange}
          className="bg-black border border-purple-700 px-4 py-2 rounded-lg text-sm w-64"
        />

        <select
          value={filter}
          onChange={handleFilterChange}
          className="bg-black border border-purple-700 px-3 py-2 rounded-lg text-sm"
        >
          <option value="ALL">All</option>
          <option value="HAZARDOUS">Hazardous</option>
          <option value="SAFE">Safe</option>
          <option value="HIGH">High Risk</option>
        </select>

      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition"
      >
        Logout
      </button>

    </div>
  )
}
