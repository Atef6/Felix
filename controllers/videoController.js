const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const { Anime } = require('../modules/Anime')
const Video = require('../modules/Video')
const timeSince = require('../utils/timeSince');

module.exports.downloadVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) {
        return res.status(404).json({ message: 'Video not found' });
    }

    if (!video.linkVideo) {
        return res.status(400).json({ message: 'Video link not provided' });
    }

    // Assuming linkVideo is a URL
    const videoUrl = video.linkVideo;
    res.redirect(videoUrl);
});


module.exports.IncrementView = asyncHandler(async (req, res) => {
    const { animeId, videoId } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const anime = await Anime.findById(animeId).session(session);
        if (!anime) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Anime not found' });
        }

        const video = await Video.findById(videoId).session(session);
        if (!video) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Video not found' });
        }

        video.views += 1;
        await video.save({ session });

        // Assuming anime.epsideo is an array of video IDs
        const videoIndex = anime.epsideo.findIndex(v => v.toString() === videoId);
        if (videoIndex !== -1) {
            anime.epsideo[videoIndex].views = video.views; // Sync view count
        }

        await anime.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'View count incremented successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports.mostView = asyncHandler(async (req, res) => {
    const episodes = await Video.find().sort({ views: -1 }).limit(20);
    res.status(200).json(episodes)
})

module.exports.addAllVideo = asyncHandler(async (req, res) => {
    const session = await Anime.startSession();
    session.startTransaction();
    try {
        const anime = await Anime.findById(req.params.animeId).session(session);
        if (!anime) {
            return res.status(404).json({ msg: 'Anime not Found' });
        }

        const newVideo = new Video(req.body);
        anime.epsideo.push(newVideo);

        await Promise.all([anime.save(), newVideo.save()]);
        await session.commitTransaction();

        const videoData = newVideo.toObject();
        videoData.timeSinceCreated = timeSince(videoData.createdAt);

        res.status(201).json(videoData);
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
});

module.exports.getAllVideo = asyncHandler(async (req, res) => {
    const video = await Video.find()
    res.status(200).json(video)
})

module.exports.getRecentVideo = asyncHandler(async (req, res) => {
    const videos = await Video.find().sort({ createdAt: -1 }).limit(10);
    // يجلب آخر 10 مقاطع فيديو مضافة
    res.status(200).json(videos);
});

module.exports.getVideoById = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.videoId)
    if (video) {
        res.status(200).json(video)
    } else {
        res.status(404).json({ status: "Falid", });
    }
})

module.exports.updateVideo = async (req, res) => {
    const { animeId, videoId } = req.params;
    const { titleEpsideo, imageVideo, linkVideo, numberEpsideo } = req.body;

    try {
        // Find the anime document and update video info
        const [anime, updatedVideo] = await Promise.all([
            Anime.findById(animeId),
            Video.findByIdAndUpdate(videoId, req.body, { new: true })
        ]);

        // Check if anime or video not found
        if (!anime) {
            return res.status(404).json({ success: false, message: "Anime not found" });
        }
        if (!updatedVideo) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        // Update the corresponding video info in anime
        const videoIndex = anime.epsideo.findIndex(v => v._id.toString() === videoId);
        anime.epsideo[videoIndex].titleEpsideo = titleEpsideo || anime.epsideo[videoIndex].titleEpsideo;
        anime.epsideo[videoIndex].numberEpsideo = numberEpsideo || anime.epsideo[videoIndex].numberEpsideo;
        anime.epsideo[videoIndex].imageVideo = imageVideo || anime.epsideo[videoIndex].imageVideo;
        anime.epsideo[videoIndex].linkVideo = linkVideo || anime.epsideo[videoIndex].linkVideo;

        // Save the changes to the anime document
        await anime.save();

        return res.json({ success: true, message: "Video information updated successfully", data: anime.epsideo[videoIndex] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports.deleteVideo = async (req, res) => {
    const { animeId, videoId } = req.params;

    try {
        // Find the anime
        const anime = await Anime.findById(animeId);
        if (!anime) {
            return res.status(404).json({ success: false, message: "Anime not found" });
        }

        // Find the video within the anime
        const videoIndex = anime.epsideo.findIndex(v => v._id.toString() === videoId);
        if (videoIndex === -1) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        // Remove the video from the anime
        anime.epsideo.splice(videoIndex, 1);

        // Delete the video from the Video collection
        await Video.findByIdAndDelete(videoId);

        // Save the changes to the anime document
        await anime.save();

        return res.json({ success: true, message: "Video deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


