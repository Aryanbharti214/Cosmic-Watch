const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { redisClient } = require("../config/redis");

router.get("/health", async (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    redis: redisClient.isOpen ? "connected" : "disconnected"
  });
});

module.exports = router;
