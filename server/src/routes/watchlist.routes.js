const express = require("express")
const router = express.Router()

const {
  addToWatchlist,
  getWatchlist
} = require("../controllers/watchlist.controller")

const { protect } = require("../middleware/auth.middleware")

router.post("/:neoId", protect, addToWatchlist)
router.get("/", protect, getWatchlist)

module.exports = router
