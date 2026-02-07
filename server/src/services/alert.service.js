const cron = require("node-cron")
const Alert = require("../models/alert.model")
const Notification = require("../models/notification.model")
const { getNeoFeed } = require("./nasa.service")

exports.startAlertScheduler = (io) => {

  cron.schedule("*/1 * * * *", async () => {
    try {
      console.log("Running alert scheduler...")

      const alerts = await Alert.find({ enabled: true })
      if (!alerts.length) return

      const feed = await getNeoFeed()
      const neos = Object.values(feed.near_earth_objects).flat()

      for (const alert of alerts) {

        for (const neo of neos) {

          const approach = neo.close_approach_data[0]
          if (!approach) continue

          const distance = parseFloat(
            approach.miss_distance.kilometers
          )

          const isHazardous =
            neo.is_potentially_hazardous_asteroid

          const shouldTrigger =
            distance < alert.minDistanceKm &&
            (!alert.hazardOnly || isHazardous)

          if (shouldTrigger) {

            // Save notification
            const notification = await Notification.create({
              userId: alert.userId,
              asteroidName: neo.name,
              asteroidId: neo.id,
              distance,
              hazardous: isHazardous
            })

            // Emit real-time alert
            io.emit("asteroid-alert", {
              userId: alert.userId,
              asteroidId: neo.id,
              asteroid: neo.name,
              distance,
              hazardous: isHazardous,
              createdAt: notification.createdAt
            })

            console.log(
              ` Alert triggered for user ${alert.userId} - ${neo.name}`
            )
          }
        }
      }

    } catch (error) {
      console.error("Alert Scheduler Error:", error.message)
    }
  })
}
