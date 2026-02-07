const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { redisClient } = require("../config/redis")

router.get("/health", async (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected"

  const redisStatus =
    redisClient.isOpen ? "connected" : "disconnected"

  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    mongo: mongoStatus,
    redis: redisStatus
  })
})

module.exports = router
