const express = require("express")
const morgan = require("morgan")

const dotenv = require("dotenv")

dotenv.config()

const connectToDB = require("../config/db")
connectToDB()
const cookieParse = require("cookie-parser")

// routers
const userRouter = require("../routes/user.routes")
const indexRouter = require("../routes/index.routes")


const app = express()

app.set("view engine", "ejs")
app.use(morgan("dev"))

app.use(cookieParse())

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use("/", indexRouter)
app.use("/user", userRouter)

app.use(express.static("public"))



// app.listen(8000, ()=>{
// 	console.log("Server is runnning at http://localhost:8000")
// })
module.exports = app