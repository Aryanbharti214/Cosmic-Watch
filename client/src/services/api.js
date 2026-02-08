import axios from "axios"

const API = axios.create({
  baseURL: "/api"
})

/* =========================
   Attach JWT Automatically
========================= */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token")

  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }

  return req
})

/* =========================
   AUTH
========================= */
export const registerUser = (data) =>
  API.post("/auth/register", data)

export const loginUser = (data) =>
  API.post("/auth/login", data)

/* =========================
   ASTEROIDS
========================= */
export const fetchAsteroids = () =>
  API.get("/neo/feed")

/* =========================
   WATCHLIST
========================= */
export const addToWatchlist = (neoId) =>
  API.post(`/watchlist/${neoId}`)

export const getWatchlist = () =>
  API.get("/watchlist")

export const removeFromWatchlist = (neoId) =>
  API.delete(`/watchlist/${neoId}`)
