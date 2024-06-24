const mongoose = require('mongoose')
const Video = require('./Video')

const AnimeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 250,
        unique: true
    },
    desc: {
        type: String,
        minlength: 3,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["TV", "Movie", "ONA", "OVA", "Special"],
        required: true,
    },
    Status: {
        type: String,
        enum: ["مكتمل", "يعرض الان", "قريبا"],
        required: true,
    },
    trailer: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: [String],
        enum: ["أكشن", "رومانسي", "خيال", "دراما", "جريمة", "مغامرات", "إثارة", "خيال علمي", "موسيقى", "عائلي", "شونين", "خارق للطبيعة", "غيبلي", "غموض", "مدرسي", "سينين", "كوميدي"],
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    day: {
        type: String,
        enum: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    },
    epsideo: [Video.schema]
}, { timestamps: true })

const Anime = mongoose.model("Anime", AnimeSchema)

module.exports = {
    Anime,
}