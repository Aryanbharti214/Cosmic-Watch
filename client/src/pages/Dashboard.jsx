import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import AsteroidCard from "../components/ui/AsteroidCard"
import StatsCard from "../components/ui/StatsCard"
import ChatPanel from "../components/ui/ChatPanel"
import { addToWatchlist } from "../services/api"
import Asteroid3D from "../components/ui/Asteroid3D"


import {
  fetchAsteroids,
  getWatchlist,
  removeFromWatchlist
} from "../services/api"

export default function Dashboard() {

  /* ================= STATE ================= */
  const [asteroids, setAsteroids] = useState([])
  const [filtered, setFiltered] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [selectedAsteroid, setSelectedAsteroid] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [categoryModal, setCategoryModal] = useState(null)

  /* ================= FETCH ASTEROIDS ================= */
  useEffect(() => {
    const loadAsteroids = async () => {
      try {
        const res = await fetchAsteroids()
        const data = res.data.asteroids || []
        setAsteroids(data)
        setFiltered(data)
      } catch (err) {
        console.error("Asteroid fetch error:", err)
      }
    }
    loadAsteroids()
  }, [])

  /* ================= FETCH WATCHLIST ================= */
  const loadWatchlist = async () => {
    try {
      const res = await getWatchlist()
      setWatchlist(res.data || [])
    } catch (err) {
      console.error("Watchlist fetch error:", err)
    }
  }

  useEffect(() => {
    loadWatchlist()
  }, [])
  const handleAdd = async (neoId) => {
    try {
      await addToWatchlist(String(neoId))
      await loadWatchlist() // refresh from backend immediately
    } catch (err) {
      console.error("Add failed:", err)
    }
  }


  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let temp = [...asteroids]

    if (filter === "HAZARDOUS") {
      temp = temp.filter(a => a.hazardous === true)
    }

    if (filter === "SAFE") {
      temp = temp.filter(a => a.hazardous === false)
    }

    if (filter === "HIGH") {
      temp = temp.filter(a => a.riskLevel === "High")
    }

    setFiltered(temp)
  }, [filter, asteroids])

  /* ================= SEARCH ================= */
  const handleSearch = (query) => {
    const result = asteroids.filter(a =>
      a.name.toLowerCase().includes(query.toLowerCase())
    )
    setFiltered(result)
  }

  /* ================= REMOVE WATCHLIST ================= */
  const handleRemove = async (neoId) => {
    try {
      await removeFromWatchlist(String(neoId))
      await loadWatchlist()
    } catch (err) {
      console.error("Remove failed:", err)
    }
  }

  /* ================= STATS ================= */
  const hazardousCount = asteroids.filter(a => a.hazardous === true).length

  const hasCritical = asteroids.some(a => {
    const distance =
      a.close_approach_data?.[0]?.miss_distance?.kilometers

    return (
      a.is_potentially_hazardous_asteroid &&
      distance &&
      parseFloat(distance) < 500000
    )
  })

  /* ================= CATEGORY MODAL DATA ================= */
  let modalAsteroids = []

  if (categoryModal === "ALL") {
    modalAsteroids = asteroids
  }

  if (categoryModal === "HAZARDOUS") {
    modalAsteroids = asteroids.filter(a => a.hazardous === true)
  }

  if (categoryModal === "SAFE") {
    modalAsteroids = asteroids.filter(a => a.hazardous === false)
  }

  /* ================= UI ================= */
  return (
    <>
    
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950 text-white">

        <Navbar
          onSearch={handleSearch}
          onFilter={setFilter}
        />

        {/* ===== CRITICAL ALERT ===== */}
        {hasCritical && (
          <div className="w-full bg-red-600 animate-pulse text-white text-center py-3 font-bold">
            CRITICAL ASTEROID APPROACH DETECTED
          </div>
        )}

        <div className="p-6 space-y-10">

          {/* ===== STATS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div onClick={() => setCategoryModal("ALL")} className="cursor-pointer">
              <StatsCard
                title="Total Asteroids"
                value={asteroids.length}
                color="text-purple-400"
              />
            </div>

            <div onClick={() => setCategoryModal("HAZARDOUS")} className="cursor-pointer">
              <StatsCard
                title="Potentially Hazardous"
                value={hazardousCount}
                color="text-red-400"
              />
            </div>

            <div onClick={() => setCategoryModal("SAFE")} className="cursor-pointer">
              <StatsCard
                title="Safe Objects"
                value={asteroids.length - hazardousCount}
                color="text-green-400"
              />
            </div>

          </div>

          {/* ===== ASTEROID FEED ===== */}
          <div>
            <h2 className="text-xl text-purple-400 mb-4">
              Near Earth Objects
            </h2>

            <div className="max-h-[500px] overflow-y-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((asteroid) => (
                <AsteroidCard
                  key={asteroid.id}
                  asteroid={asteroid}
                  isAdded={watchlist.some(
                    w => String(w.neoId) === String(asteroid.id)
                  )}
                  onAdd={handleAdd}
                  onClick={() => setSelectedAsteroid(asteroid)}
                />

              ))}
            </div>
          </div>

          {/* ===== WATCHLIST ===== */}
          <div className="p-6 rounded-2xl bg-black/40 border border-purple-800 backdrop-blur-xl">
            <h2 className="text-yellow-400 font-semibold mb-4 text-lg">
              Watchlist
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {watchlist.map((item) => (
                <div
                  key={item.neoId}
                  className="bg-purple-900/20 border border-purple-700 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      Risk Score: {item.riskScore}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemove(item.neoId)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
              {/* ===== 3D ORBIT VISUALIZATION ===== */}
<div className="px-6 pb-20">
  <h2 className="text-xl text-purple-400 mb-6">
    Orbital Simulation
  </h2>

  <Asteroid3D asteroids={asteroids} />
</div>

        {/* ===== FLOATING CHAT ===== */}
        <div className="fixed bottom-6 right-6 z-50 group">

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/50 flex items-center justify-center text-2xl transition-all duration-300"
          >
            💬
          </button>

          {/* Hover Text */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 
                  bg-black/90 border border-purple-600 
                  text-xs px-3 py-1 rounded-lg 
                  opacity-0 group-hover:opacity-100 
                  transition-all duration-300 
                  pointer-events-none">
            🟢 Live Server
          </div>

        </div>


        {isChatOpen && (
          <div className="fixed bottom-24 right-6 w-[350px] h-[450px] bg-black border border-purple-700 rounded-2xl">
            <ChatPanel />
          </div>
        )}
      </div>

      {/* ===== CATEGORY MODAL ===== */}
      {categoryModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-950 border border-purple-700 rounded-2xl w-[90%] max-w-4xl p-6 relative">

            <button
              onClick={() => setCategoryModal(null)}
              className="absolute top-4 right-4 text-gray-400"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold text-purple-400 mb-6">
              {categoryModal === "ALL" && "All Asteroids"}
              {categoryModal === "HAZARDOUS" && "Hazardous Asteroids"}
              {categoryModal === "SAFE" && "Safe Asteroids"}
            </h2>

            <div className="max-h-[400px] overflow-y-auto grid md:grid-cols-2 gap-4">
              {modalAsteroids.map((asteroid) => (
                <div
                  key={asteroid.id}
                  className="bg-black/40 border border-purple-800 rounded-xl p-4"
                >
                  <p className="font-semibold">{asteroid.name}</p>
                  <p className="text-xs text-gray-400">
                    ID: {asteroid.id}
                  </p>
                  <p className={`text-sm ${asteroid.hazardous
                    ? "text-red-400"
                    : "text-green-400"
                    }`}>
                    {asteroid.hazardous ? "Hazardous" : "Safe"}
                  </p>
                </div>
              ))}
            </div>

          </div>
          
        </div>
        
      )}
    
    </>
    
  )
}
