const mongoose = require('mongoose')
const asyncHandler = require("express-async-handler");
const { Watchlist } = require('../modules/WatchList')

module.exports.addList = asyncHandler(async (req, res) => {
    const { user, anime } = req.body;
    const watchlist = new Watchlist({ user, anime });
    await watchlist.save();
    res.status(201).json(watchlist);
})

module.exports.updateList = asyncHandler(async (req, res) => {
    const { anime } = req.body;
    const id = req.params.id;
    if (!anime || !mongoose.Types.ObjectId.isValid(anime)) {
        return res.status(400).json('Invalid anime ID.');
    }
    const watchlist = await Watchlist.findOne({ user: id });
    if (!watchlist) {
        return res.status(404).json('Watchlist not found.');
    }
    if (!watchlist.anime.includes(anime)) {
        watchlist.anime.push(anime);
        await watchlist.save();
    }
    res.status(200).json(watchlist);
})

module.exports.getList = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const watchlist = await Watchlist.findOne({ user: id }).populate('anime');
    if (!watchlist) {
        return res.status(404).json('Watchlist not found.');
    }
    res.status(200).json(watchlist);
})

module.exports.deleteList = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const watchlist = await Watchlist.findOneAndDelete({ user: id });
    if (!watchlist) {
        return res.status(404).json('Watchlist not found.');
    }
    res.status(200).json('Watchlist deleted.');
});