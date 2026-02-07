const express = require("express")
const router = express.Router()

const { getFeed } = require("../controllers/neo.controller")
const { protect } = require("../middleware/auth.middleware")

router.get("/feed", protect, getFeed)

module.exports = router
