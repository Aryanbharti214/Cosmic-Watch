const cron = require("node-cron")
const Alert = require("../models/alert.model")
const { getNeoFeed } = require("./nasa.service")

exports.startAlertScheduler = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Running alert scheduler...")

    const alerts = await Alert.find({ enabled: true })

    const feed = await getNeoFeed()

    const neos = Object.values(feed.near_earth_objects).flat()

    alerts.forEach((alert) => {
      neos.forEach((neo) => {
        const approach = neo.close_approach_data[0]
        const distance = parseFloat(
          approach.miss_distance.kilometers
        )

        if (
          distance < alert.minDistanceKm &&
          (!alert.hazardOnly ||
            neo.is_potentially_hazardous_asteroid)
        ) {
          console.log(
            `🚨 ALERT: ${neo.name} close to user ${alert.userId}`
          )
        }
      })
    })
  })
}
