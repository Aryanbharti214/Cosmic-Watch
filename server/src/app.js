const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/auth.routes")

const app = express()

const neoRoutes = require("./routes/neo.routes")

app.use("/api/neo", neoRoutes)
const notificationRoutes = require("./routes/notification.routes")
app.use("/api/notifications", notificationRoutes)


const watchlistRoutes = require("./routes/watchlist.routes")
app.use("/api/watchlist", watchlistRoutes)

const systemRoutes = require("./routes/system.routes")
app.use("/api/system", systemRoutes)
const healthRoutes = require("./routes/health.routes");
app.use("/api", healthRoutes);


app.use(cors())
app.use(express.json())
const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later"
})

app.use(limiter)

app.use("/api/auth", authRoutes)

module.exports = app

const { errorHandler } = require("./middleware/error.middleware")

app.use(errorHandler)
