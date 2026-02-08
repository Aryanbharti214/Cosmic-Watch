import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../services/api"
import bgVideo from "../assets/bg2.mp4"

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await loginUser(form)

      // Store token
      localStorage.setItem("token", res.data.token)

      // Redirect to dashboard
      navigate("/dashboard")

    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
  <div className="relative min-h-screen flex items-center justify-end text-white overflow-hidden pr-20">

    {/* 🎥 Background Video */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src={bgVideo} type="video/mp4" />
    </video>

    {/* Dark Overlay for readability */}
    <div className="absolute inset-0 bg-black/30 "></div>

    {/* Login Card */}
    <form
      onSubmit={handleSubmit}
      className="relative z-10 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-purple-800 w-96 space-y-6 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-purple-400 text-center">
         Mission Login
      </h2>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full bg-black/50 border border-purple-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full bg-black/50 border border-purple-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />

      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition duration-300 shadow-lg"
      >
        Launch
      </button>
    </form>

  </div>
)

}
