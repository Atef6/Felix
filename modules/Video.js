const mongoose = require('mongoose')

const VideoSchema = new mongoose.Schema({
    titleEpsideo: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    numberEpsideo: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 200,
        required: true,
    },
    imageVideo: {
        type: String,
        required: true,
        trim: true,
    },
    linkVideo: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0, // Initialize views count to zero
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true })


module.exports = mongoose.model("Video", VideoSchema)
