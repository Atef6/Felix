const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const { Anime } = require('../modules/Anime')
const Video = require('../modules/Video')
const timeSince = require('../utils/timeSince');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');


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

// Helper function to convert .m3u8 to .mp4
const convertM3U8toMP4 = async (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .run();
    });
};

// Add a new video, optionally converting .m3u8 to .mp4 before saving
module.exports.addAllVideo = asyncHandler(async (req, res) => {
    const session = await Anime.startSession();
    session.startTransaction();

    try {
        const anime = await Anime.findById(req.params.animeId).session(session);
        if (!anime) {
            return res.status(404).json({ msg: 'Anime not found' });
        }

        // Create a new video instance
        const newVideo = new Video({
            titleEpsideo: req.body.titleEpsideo,
            numberEpsideo: req.body.numberEpsideo,
            imageVideo: req.body.imageVideo,
            linkVideo: req.body.linkVideo,
        });

        // Check if the video link ends with .m3u8 for conversion
        if (newVideo.linkVideo.endsWith('.m3u8')) {
            const inputPath = newVideo.linkVideo;
            const outputFileName = `${newVideo._id}.mp4`;
            const outputFilePath = path.join(__dirname, '../uploads', outputFileName);

            // Convert .m3u8 to .mp4
            await convertM3U8toMP4(inputPath, outputFilePath);

            // Update linkVideo to .mp4 file path
            newVideo.linkVideo = outputFilePath;
        }

        // Push the new video to anime's epsideo array
        anime.epsideo.push(newVideo);

        // Save both anime and newVideo
        await Promise.all([anime.save(), newVideo.save()]);
        await session.commitTransaction();

        // Prepare response data
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

        // Check if linkVideo is updated and ends with .m3u8
        if (linkVideo && linkVideo.endsWith('.m3u8')) {
            const inputPath = linkVideo;
            const outputFileName = `${videoId}.mp4`;
            const outputFilePath = path.join(__dirname, '../uploads', outputFileName);

            // Convert .m3u8 to .mp4
            await convertM3U8toMP4(inputPath, outputFilePath);

            // Update linkVideo to .mp4 file path
            anime.epsideo[videoIndex].linkVideo = outputFilePath;
            updatedVideo.linkVideo = outputFilePath; // Also update in Video document
        } else {
            anime.epsideo[videoIndex].linkVideo = linkVideo || anime.epsideo[videoIndex].linkVideo;
            updatedVideo.linkVideo = linkVideo || updatedVideo.linkVideo; // Update in Video document
        }

        // Save the changes to both anime and updatedVideo
        await Promise.all([anime.save(), updatedVideo.save()]);

        return res.json({ success: true, message: "Video information updated successfully", data: anime.epsideo[videoIndex] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

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


