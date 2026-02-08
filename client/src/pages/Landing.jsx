import { Link } from "react-router-dom"

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 opacity-80"></div>

      {/* Stars Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-40">

        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Cosmic Watch
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl">
          Real-time hazardous asteroid tracking powered by NASA data.
          Monitor cosmic threats, analyze risk levels, and collaborate live.
        </p>

        <div className="mt-10 flex gap-6">
          <Link
            to="/login"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-lg"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 border border-purple-500 hover:bg-purple-500/20 rounded-xl transition"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Feature Section */}
      <div className="relative z-10 py-24 px-8">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-16">
          Mission Capabilities
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <div className="p-8 bg-black/40 backdrop-blur-xl rounded-xl border border-purple-800">
            <h3 className="text-xl font-semibold mb-4">🚀 Real-Time Tracking</h3>
            <p className="text-gray-400">
              Live asteroid data fetched directly from NASA's Near Earth Object API.
            </p>
          </div>

          <div className="p-8 bg-black/40 backdrop-blur-xl rounded-xl border border-blue-800">
            <h3 className="text-xl font-semibold mb-4">📊 Risk Analytics</h3>
            <p className="text-gray-400">
              Advanced hazard classification with dynamic risk indicators.
            </p>
          </div>

          <div className="p-8 bg-black/40 backdrop-blur-xl rounded-xl border border-red-800">
            <h3 className="text-xl font-semibold mb-4">💬 Live Discussion</h3>
            <p className="text-gray-400">
              Real-time asteroid chat using WebSockets for collaborative monitoring.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-10 text-gray-500 text-sm">
        © 2026 Cosmic Watch — Mission Control Interface
      </div>

    </div>
  )
}
