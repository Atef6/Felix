const express = require('express')
const { addAllVideo, getAllVideo, getVideoById, deleteVideo, updateVideo, mostView, IncrementView, getRecentVideo, downloadVideo } = require('../controllers/videoController')
const router = express.Router()

/* 
 * @desc GET VideoDownload
 * @route /videos/:id/download
 * @method GET
 * @acess public
*/

router.get('api/video/:id/download', downloadVideo)

/* 
 * @desc GET All Anime RecentEpsideo
 * @route /api/anime/video
 * @method GET
 * @acess public
*/

router.get('/api/recent/video', getRecentVideo)

/*
  * @desc IncrementView Video Watch
  * @route /api/video/:animeId/videos/:videoId/incrementView
  * @method PUT
  * @acess public
*/

router.put('/api/video/:animeId/videos/:videoId/incrementView', IncrementView)

/*
  * @desc most Video Watch
  * @route /api/video/most-viewed
  * @method GET
  * @acess public
*/


router.get('/api/video/most-viewed', mostView)

/*
  * @desc Add Anime Epsideo
  * @route /api/anime/:animeId/video
  * @method POST
  * @acess public
*/

router.post('/api/:animeId/video', addAllVideo)

/*
  * @desc GET All Anime Epsideo
  * @route /api/anime/video
  * @method GET
  * @acess public
*/

router.get('/api/video', getAllVideo)

/*
  * @desc Get Anime Epsideo ById
  * @route /api/anime/video/:videoId
  * @method GET
  * @acess public
*/

router.get('/api/video/:videoId', getVideoById)

/*
  * @desc  update Video
  * @route /api/anime/video/:id
  * @method PUT
  * @acess public
*/

router.put('/api/:animeId/video/:videoId', updateVideo);

/*
  * @desc  delete Video
  * @route /api/anime/video/:id
  * @method DELETE
  * @acess public
*/

router.delete('/api/:animeId/video/:videoId', deleteVideo);

module.exports = router