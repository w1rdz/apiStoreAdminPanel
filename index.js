const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter")
const PORT = process.env.PORT || 8800;


const app = express();

app.use(express.json())
app.use("/auth", authRouter)

const start = async () =>{
    try {
        await mongoose.connect(`mongodb+srv://qwerty:Qwerty1234@cluster0.adzvf5g.mongodb.net/ProductStore?retryWrites=true&w=majority&appName=Cluster0`)
        app.listen(PORT,(req,res)=> console.log(`server started on port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()