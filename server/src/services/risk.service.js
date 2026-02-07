exports.calculateRiskScore = (neo) => {
  const hazardous = neo.is_potentially_hazardous_asteroid

  const diameter =
    neo.estimated_diameter.kilometers.estimated_diameter_max

  const approach = neo.close_approach_data[0]

  const velocity = parseFloat(
    approach.relative_velocity.kilometers_per_hour
  )

  const missDistance = parseFloat(
    approach.miss_distance.kilometers
  )

  let score = 0

  if (hazardous) score += 50

  score += diameter * 20

  score += (1 / missDistance) * 1000000

  score += velocity / 10000

  let level = "Low"

  if (score > 80) level = "Extreme"
  else if (score > 60) level = "High"
  else if (score > 30) level = "Moderate"

  return {
    score: Number(score.toFixed(2)),
    level
  }
}
