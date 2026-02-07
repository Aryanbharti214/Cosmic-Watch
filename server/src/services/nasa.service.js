const axios = require("axios")
const { redisClient } = require("../config/redis")

const BASE_URL = "https://api.nasa.gov/neo/rest/v1"
const API_KEY = process.env.NASA_API_KEY

exports.getNeoFeed = async () => {
  const cacheKey = "neo_feed_today"

  const cached = await redisClient.get(cacheKey)
  if (cached) {
    console.log("Serving from Redis cache")
    return JSON.parse(cached)
  }

  const response = await axios.get(
    `${BASE_URL}/feed?api_key=${API_KEY}`
  )

  await redisClient.setEx(
    cacheKey,
    600, // 10 minutes
    JSON.stringify(response.data)
  )

  return response.data
}
