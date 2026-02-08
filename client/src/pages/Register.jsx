import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import bgVideo from "../assets/bg2.mp4"
export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        "/api/auth/register",
        form
      )

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      navigate("/dashboard")

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-end text-white overflow-hidden pr-20">
      <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src={bgVideo} type="video/mp4" />
    </video>

      <form
        onSubmit={handleSubmit}
        className="bg-black/40 backdrop-blur-xl p-8 rounded-xl border border-purple-800 w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-400 text-center">
          Register
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-3 bg-black border border-purple-700 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 bg-black border border-purple-700 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 bg-black border border-purple-700 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded transition"
        >
          Create Account
        </button>

      </form>

    </div>
  )
}



