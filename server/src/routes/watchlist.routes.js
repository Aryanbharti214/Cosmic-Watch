const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

const Watchlist = require("../models/watchlist.model")
const {
  addToWatchlist,
  getWatchlist
} = require("../controllers/watchlist.controller")

const { protect } = require("../middleware/auth.middleware")

/* ==============================
   ADD
============================== */
router.post("/:neoId", protect, addToWatchlist)

/* ==============================
   GET
============================== */
router.get("/", protect, getWatchlist)

/* ==============================
   DELETE
============================== */
router.delete("/:neoId", protect, async (req, res) => {
  try {
    const { neoId } = req.params

    const deleted = await Watchlist.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(req.user.id),
      neoId: String(neoId)
    })

    if (!deleted) {
      return res.status(404).json({
        message: "Asteroid not found"
      })
    }

    res.status(200).json({
      message: "Removed successfully"
    })

  } catch (err) {
    console.error("Delete error:", err)
    res.status(500).json({
      message: "Server error"
    })
  }
})

module.exports = router
