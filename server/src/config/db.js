require('dotenv').config()
const mongoose=require('mongoose')

async function connectToDB() {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to Monogo DB Successfully")
    }
    catch(err){
        console.log(`Error Connection to The DB Failed ${err.message}`)
    }
}

module.exports=connectToDB