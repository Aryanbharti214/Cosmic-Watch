import { addToWatchlist } from "../../services/api"
import { useState } from "react"

export default function AsteroidCard({ asteroid, isAdded, onClick, onAdd }) {

  const [loading, setLoading] = useState(false)

  const handleWatchlist = async (e) => {
    e.stopPropagation()

    if (isAdded) return

    try {
      setLoading(true)
      await onAdd(asteroid.id)
    } catch (err) {
      console.error("Add error:", err)
    } finally {
      setLoading(false)
    }
  }


  const riskColor = {
    Low: "text-green-400 border-green-500/30",
    Medium: "text-yellow-400 border-yellow-500/30",
    High: "text-orange-400 border-orange-500/30",
    Critical: "text-red-500 border-red-500/40 animate-pulse"
  }

  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-5 rounded-xl border border-purple-800 bg-black/40 backdrop-blur-xl hover:scale-105 transition"
    >




      <h3 className="text-lg font-semibold">
        {asteroid.name}
      </h3>

      <div className="mt-3 space-y-1 text-sm text-gray-300">
        <p>ID: {asteroid.id}</p>
        <p>Hazardous: {asteroid.hazardous ? "Yes" : "No"}</p>
        <p>Risk Score: {asteroid.riskScore}</p>
        <p className={`${riskColor[asteroid.riskLevel]?.split(" ")[0]}`}>
          Risk Level: {asteroid.riskLevel}
        </p>
      </div>

      <button
        onClick={
          handleWatchlist}
        disabled={loading || isAdded}
        className={`mt-4 px-4 py-2 rounded text-sm ${isAdded
            ? "bg-green-600 cursor-not-allowed"
            : "bg-yellow-600 hover:bg-yellow-700"
          }`}
      >
        {isAdded ? "✓ Added" : loading ? "Adding..." : "Add to Watchlist"}
      </button>


    </div>
  )
}
