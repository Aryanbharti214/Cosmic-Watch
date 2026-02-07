// require('dotenv').config()
// const express=require('express')
// const connectToDB=require('./config/db')
// const app=express()

// connectToDB();

// app.use(express.json())

// const port=process.env.PORT;
// app.listen(port,()=>{
//     console.log(`DATA BASE CONNECTED SUCCESSFULLY TO PORT ${port}`)
// })

require("dotenv").config()

const app = require("./app")
const connectToDB = require("./config/db")
const { connectRedis } = require("./config/redis")

connectToDB()
connectRedis()

const { startAlertScheduler } = require("./services/alert.service")

startAlertScheduler()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
