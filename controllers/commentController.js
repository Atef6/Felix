const asyncHandler = require("express-async-handler");
const { Comment } = require('../modules/Comment');
const { User } = require('../modules/User');

module.exports.addComments = asyncHandler(async (req, res) => {
    if (!req.body.comment) {
        res.status(404);
        throw new Error("No Data enter");
    }
    const comment = await Comment.create(
        {
            ...req.body,
            user: req.user.id,
        }
    );
    res.status(201).json({ status: "Success", comment });
})

module.exports.updateComments = asyncHandler(async (req, res) => {
    const comments = await Comment.findById(req.params.id)
    if (!comments) {
        res.status(404);
        throw new Error("No Data enter");
    }
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(401);
        throw new Error("user not Found");
    }
    if (comments.user.toString() !== user.id) {
        res.status(401);
        throw new Error("user not authorized");
    }
    const updateComment = await Comment.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

    res.status(200).json({ status: "Success", updateComment });
})

module.exports.deleteComments = asyncHandler(async (req, res) => {
    const comments = await Comment.findById(req.params.id);
    if (!comments) {
        res.status(400);
        throw new Error("Comments not Found");
    }
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(401);
        throw new Error("user not Found");
    }
    if (comments.user.toString() !== user.id) {
        res.status(401);
        throw new Error("user not authorized");
    }
    await Comment.findByIdAndDelete(req.params.id)
    res
        .status(200)
        .json({ message: `Delete Comment ${req.params.id}`, comments });
})

module.exports.getAllComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ user: req.user.id }).sort({ createdAt: 'desc' });
    res.status(200).json({ status: "Success", comments });
})

module.exports.getCommentsById = asyncHandler(async (req, res) => {
    const comments = await Comment.findById(req.params.id);
    if (comments) {
        res.status(200).json({ status: "Success", comments });
    } else {
        res.status(404).json({ message: "Comment Not Found !🐸" })
    }
})