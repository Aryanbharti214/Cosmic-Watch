const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema(
  {
    asteroidId: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Chat", chatSchema)
