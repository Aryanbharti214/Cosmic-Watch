const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  asteroidName: String,
  asteroidId: String,
  distance: Number,
  hazardous: Boolean,
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema)
