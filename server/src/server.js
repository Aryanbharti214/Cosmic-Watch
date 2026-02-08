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


//   Socket.IO Setup


const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
})


app.set("io", io)


//   Socket Events


io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

//JOIN ROOM (Dynamic) 
  socket.on("join-asteroid", async (asteroidId) => {
    if (!asteroidId) return

    socket.join(asteroidId)

    console.log(`${socket.id} joined room: ${asteroidId}`)

    try {
      const messages = await Chat.find({ asteroidId })
        .populate("userId", "name") // get username
        .sort({ createdAt: -1 })
        .limit(30)
        .lean()

      socket.emit("chat-history", messages.reverse())
    } catch (error) {
      console.error("Failed to load chat history:", error.message)
    }
  })

  // SEND MESSAGE 
  socket.on("send-message", async (data) => {
    try {
      const { asteroidId, userId, message } = data

      if (!asteroidId || !userId || !message) {
        console.log("Invalid chat payload")
        return
      }

      const savedMessage = await Chat.create({
        asteroidId,
        userId,
        message
      })

      const populatedMessage = await savedMessage.populate(
        "userId",
        "name"
      )

      io.to(asteroidId).emit("receive-message", populatedMessage)

    } catch (error) {
      console.error("Chat error:", error.message)
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})


 //  Start Alert Scheduler


const { startAlertScheduler } = require("./services/alert.service")
startAlertScheduler(io)


//   Start Server


const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
