const router = require("express").Router()
const verify = require("./verifyToken")
const User = require("../models/user")


router.get("/", verify, async (req,res) => {
    const user_name = await User.findOne({ _id: req.user._id })
    res.send(user_name.name)
})


module.exports = router