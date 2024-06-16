const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    anime: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anime',
        required: true,
    }],
}, { timestamps: true });

const Watchlist = mongoose.model('Watchlist', WatchlistSchema);

module.exports = Watchlist;
