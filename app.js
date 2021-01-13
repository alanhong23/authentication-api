const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv/config")

//import routes
const AuthRoute = require("./routes/auth")
const PostRoute = require("./routes/posts")

//connect to database
mongoose.connect(
    process.env.DB_connect,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    },
    () => console.log("connect to db")
)

//middleware
app.use(express.json());

//route middleware
app.use("/api/user", AuthRoute)
app.use("/api/posts", PostRoute)

app.listen(3000,() => console.log("server started"))