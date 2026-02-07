const mongoose = require("mongoose")

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    neoId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    riskScore: {
      type: Number,
      required: true
    },
    closeApproachDate: {
      type: Date
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Watchlist", watchlistSchema)
