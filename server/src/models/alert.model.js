const mongoose = require("mongoose")

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    minDistanceKm: {
      type: Number,
      default: 1000000
    },
    hazardOnly: {
      type: Boolean,
      default: false
    },
    enabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Alert", alertSchema)
