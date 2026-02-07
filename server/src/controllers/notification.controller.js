const Notification = require("../models/notification.model")

exports.getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id
  }).sort({ createdAt: -1 })

  res.status(200).json(notifications)
}

exports.markAsRead = async (req, res) => {
  const { id } = req.params

  const notification = await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  )

  res.status(200).json(notification)
}
