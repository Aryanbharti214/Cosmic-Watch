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
let cachedData = null
let lastFetchTime = 0

exports.getNeoFeed = async (req, res) => {
  const now = Date.now()

  // cache for 1 hour
  if (cachedData && now - lastFetchTime < 3600000) {
    return res.json(cachedData)
  }

  const response = await axios.get(NASA_URL)
  cachedData = response.data
  lastFetchTime = now

  res.json(response.data)
}
