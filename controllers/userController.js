const bcrypt = require('bcryptjs')
const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require('../modules/User')
const { Comment } = require('../modules/Comment')
const Watchlist = require('../modules/WatchList')

module.exports.getAllUsers = asyncHandler(async (req, res) => {
    const user = await User.find().select('-password')
    res.status(200).json(user)
})

module.exports.getUsersById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({ msg: "user not found" });
    }
})

module.exports.updateUsers = asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body)
    if (error) {
        return res.status(400).json({ msg: error.details[0].message })
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    const UpdateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            profilePic: req.body.profilePic,
        }
    }, { new: true }).select('-password')
    res.status(200).json(UpdateUser)
})

module.exports.deleteUsers = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    //check for user
    if (!user) {
        res.status(401);
        throw new Error("user not Found");
    }

    // Delete all comment made by the user
    const allData = await Comment.deleteMany({ user: req.params.id });
    const allwatchlist = await Watchlist.deleteMany({ user: req.params.id })
    await User.findByIdAndDelete(req.params.id);
    res
        .status(200)
        .json({ message: `Delete User ${req.params.id}`, user, allData, allwatchlist });
})