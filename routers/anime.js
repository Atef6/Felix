const express = require('express')
const { addAllAnimes, getAllAnimes, getAnimeById, updateAnime, deleteAnime, randomAnime, TopAnime, animeDays } = require('../controllers/animeController')
const router = express.Router()

/* 
 * @desc GET All Anime Calander
 * @route /api/anime/:day
 * @method GET
 * @acess public
*/

router.get('/api/anime/day', animeDays)

/*
  * @desc Top Anime
  * @route /api/top/anime
  * @method GET
  * @acess public
*/

router.get('/api/top/anime', TopAnime)

/*
  * @desc Random Anime
  * @route /api/random-anime
  * @method GET
  * @acess public
*/

router.get('/api/random/anime', randomAnime)

/*
  * @desc Add Anime
  * @route /api/anime
  * @method POST
  * @acess public
*/

router.post('/api/anime', addAllAnimes)

/*
  * @desc Get All Anime
  * @route /api/anime
  * @method GET
  * @acess public
*/

router.get('/api/anime', getAllAnimes)

/*
  * @desc Get Anime By Id
  * @route /api/anime/:id
  * @method GET
  * @acess public
*/

router.get('/api/anime/:id', getAnimeById)

/*
  * @desc Update Anime
  * @route /api/anime/:id
  * @method PUT
  * @acess public
*/

router.put('/api/anime/:id', updateAnime)

/*
  * @desc Delete Anime
  * @route /api/anime/:id
  * @method DELETE
  * @acess public
*/

router.delete('/api/anime/:id', deleteAnime)

module.exports = router