const Watchlist = require("../models/watchlist.model")
const { getNeoById } = require("../services/nasa.service")
const { calculateRiskScore } = require("../services/risk.service")

exports.addToWatchlist = async (req, res) => {
  try {
    const { neoId } = req.params

    const neo = await getNeoById(neoId)

    const risk = calculateRiskScore(neo)

    const saved = await Watchlist.create({
      userId: req.user._id,
      neoId,
      name: neo.name,
      riskScore: risk.score,
      closeApproachDate:
        neo.close_approach_data[0].close_approach_date
    })

    res.status(201).json(saved)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getWatchlist = async (req, res) => {
  const list = await Watchlist.find({
    userId: req.user._id
  })

  res.status(200).json(list)
}
