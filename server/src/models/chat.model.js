const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
  asteroidId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model("Chat", chatSchema)
