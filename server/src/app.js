const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const path = require("path")

const authRoutes = require("./routes/auth.routes")
const neoRoutes = require("./routes/neo.routes")
const notificationRoutes = require("./routes/notification.routes")
const watchlistRoutes = require("./routes/watchlist.routes")
const systemRoutes = require("./routes/system.routes")
const healthRoutes = require("./routes/health.routes")

const { errorHandler } = require("./middleware/error.middleware")

const app = express()

// ------------------
// CORS
// ------------------

app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json())

// ------------------
// RATE LIMITING
// ------------------

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

app.use(limiter)

// ------------------
// API ROUTES
// ------------------

app.use("/api/auth", authRoutes)
app.use("/api/neo", neoRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/watchlist", watchlistRoutes)
app.use("/api/system", systemRoutes)
app.use("/api", healthRoutes)

// ------------------
// SERVE FRONTEND BUILD
// ------------------

const frontendPath = path.join(__dirname, "../../client/dist")

app.use(express.static(frontendPath))

app.get("/*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"))
})

// ------------------
// ERROR HANDLER
// ------------------

app.use(errorHandler)

module.exports = app
