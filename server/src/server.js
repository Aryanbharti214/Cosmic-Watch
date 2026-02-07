require("dotenv").config()

const http = require("http")
const { Server } = require("socket.io")

const app = require("./app")
const connectToDB = require("./config/db")
const { connectRedis } = require("./config/redis")
const Chat = require("./models/chat.model")

//   Initialize Database Connections


async function initConnections() {
  try {
    await connectToDB()
    await connectRedis()
    console.log("Databases Connected")
  } catch (err) {
    console.error("Database Connection Failed:", err.message)
    process.exit(1)
  }
}

initConnections()


//   Create HTTP Server


const server = http.createServer(app)


 //  Socket.IO Setup


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

app.set("io", io)


 //  Socket Events


io.on("connection", (socket) => {
  console.log(" User connected:", socket.id)

  /* Join Room */
  socket.on("join-asteroid", async (asteroidId) => {
    socket.join(asteroidId)

    console.log(`${socket.id} joined room: ${asteroidId}`)
    console.log(
      "Room members:",
      io.sockets.adapter.rooms.get(asteroidId)?.size || 0
    )

    try {
      const messages = await Chat.find({ asteroidId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()

      socket.emit("chat-history", messages.reverse())
    } catch (error) {
      console.error(" Failed to load chat history:", error.message)
    }
  })

  /* Live Message Handling */
  socket.on("send-message", async (data) => {
    try {
      const { asteroidId, userId, message } = data

      console.log(` Message in ${asteroidId}:`, message)

      const savedMessage = await Chat.create({
        asteroidId,
        userId,
        message
      })

      io.to(asteroidId).emit("receive-message", {
        asteroidId,
        userId,
        message,
        createdAt: savedMessage.createdAt
      })

    } catch (error) {
      console.error(" Chat error:", error.message)
    }
  })

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id)
  })
})


//   Start Alert Scheduler


const { startAlertScheduler } = require("./services/alert.service")
startAlertScheduler(io)


//   Root Health Check


app.get("/", (req, res) => {
  res.json({
    status: "Cosmic Watch Backend Running 🚀"
  })
})


//  Start Server


const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`)
})
