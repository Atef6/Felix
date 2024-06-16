const express = require('express')
const { addList, updateList, deleteList, getList } = require('../controllers/listController')
const { checkUser } = require('../middlewares/checkuser')
const router = express.Router()

/*
 * @route POST /api/watchlists
 * @desc Add a new watchlist
 * @access Private
 */

router.post('/api/watchlists', checkUser, addList);

/*
 * @route PUT /api/watchlists/:id
 * @desc Update a watchlist by adding a new anime
 * @access Private
 */

router.put('/api/watchlists/:id', checkUser, updateList);

/*
 * @route GET /api/watchlists/:id
 * @desc Get a watchlist by user ID
 * @access Private
 */

router.get('/api/watchlists/:id', checkUser, getList);

/*
 * @route DELETE /api/watchlists/:id
 * @desc Delete a watchlist by user ID
 * @access Private
 */

router.delete('/api/watchlists/:id', checkUser, deleteList);

module.exports = router