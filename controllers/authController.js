const bcrypt = require('bcryptjs')
const asyncHandler = require("express-async-handler");
const { User, validateRegisterUser, validateLoginUser } = require('../modules/User')

module.exports.register = asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { username, email, password, profilePic } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ msg: "User already exists 🐸" })
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    let user = new User({
        username,
        email,
        password: hashPassword,
        profilePic,
    })
    user = await user.save()
    const token = user.generateToken()
    res.json({ token, ...user._doc })
})

module.exports.login = asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ msg: "User with this email does not exist 🐸" })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
    }
    const token = user.generateToken()
    res.json({ token, ...user._doc })
})