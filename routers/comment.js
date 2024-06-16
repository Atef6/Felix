const express = require('express');
const { addComments, updateComments, deleteComments, getAllComments, getCommentsById } = require('../controllers/commentController')
const router = express.Router();

/*
 *  @desc    Add a new comment
 *  @route   /api/comments
 *  @method  POST
 *  @access  public
 */

router.post('/api/comments', addComments);

/*
 *  @desc    Update a comment
 *  @route   /api/comments/:id
 *  @method  PUT
 *  @access  public
 */

router.put('/api/comments/:id', updateComments);

/*
 *  @desc    Delete a comment
 *  @route   /api/comments/:id
 *  @method  DELETE
 *  @access  public
 */

router.delete('/api/comments/:id', deleteComments);

/*
 *  @desc    Get all comments
 *  @route   /api/users/:id
 *  @method  GET
 *  @access  public
 */

router.get('/api/comments', getAllComments);

/*
 *  @desc    Get comments ById
 *  @route   /api/users/:id
 *  @method  GET
 *  @access  public
 */

router.get('/api/comments/:id', getCommentsById);

module.exports = router;
