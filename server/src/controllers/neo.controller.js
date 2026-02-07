const { getNeoFeed, getNeoById } = require("../services/nasa.service")
const { calculateRiskScore } = require("../services/risk.service")

exports.getFeed = async (req, res) => {
  try {
    const data = await getNeoFeed()
  
    const formatted = Object.values(
      data.near_earth_objects
    ).flat().map((neo) => {
      const risk = calculateRiskScore(neo)

      return {
        id: neo.id,
        name: neo.name,
        hazardous: neo.is_potentially_hazardous_asteroid,
        riskScore: risk.score,
        riskLevel: risk.level
      }
    })

    res.status(200).json({
      count: formatted.length,
      asteroids: formatted
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
