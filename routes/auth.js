const router = require("express").Router()
const User = require("../models/user")
const schema = require("../validation.js")
const bcrypt = require("bcryptjs")
const {loginValidation} = require("../validation")
const jwt = require("jsonwebtoken")
require("dotenv/config")

router.post("/register", async (req,res) => {

    //validation
    const {error} = schema.registerValidation(req.body)
    if (error) return res.status(400).send({message: error.details[0].message})

    //check if email is exist
    const email_exist = await User.findOne({email: req.body.email})
    if(email_exist) return res.status(400).send({message: "email already exist"})

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashed_password = await bcrypt.hash(req.body.password, salt)

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashed_password
    })

    try {
        //get sorted data
        // const sort_data = await User.find().sort({ date: -1 })
        // res.send(sort_data)

        const savedData = await user.save()
        res.send({ user: savedData._id})
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post("/login", async(req, res) =>{
    
    //validation
    const {error} = loginValidation(req.body)
    if (error) return res.status(400).send({message: error.details[0].message})

    //check if email is exist
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send({message: "email hadn't register"})

    //check if password is correct with the email
    const valid_password = await bcrypt.compare(req.body.password, user.password)
    if(!valid_password) return res.status(400).send({message: "email or password is wrong"})

    //create and asign token 
    const token = jwt.sign({ _id: user._id }, process.env.token_secret)
    res.header("auth-token", token).send(token)
})

module.exports = router