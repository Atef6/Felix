const mongoose = require('mongoose')

const CommentSchame = new mongoose.Schema({
    animeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Anime",
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comment: {
        type: String,
        minlength: 3,
        maxlength: 250,
        required: true,
    },
    reply: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            text: {
                type: String,
                minlength: 3,
                maxlength: 250,
                required: true,
            }

        }
    ],
    createdAt: {
        type: Date,
        default: new Date().getTime(),
    },
}, { timestamps: true })

const Comment = mongoose.model("Comment", CommentSchame)

module.exports = { Comment }