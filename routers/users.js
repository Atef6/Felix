const express = require('express')
const { getAllUsers, getUsersById, updateUsers, deleteUsers } = require('../controllers/userController')
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middlewares/verifyToken')
const router = express.Router()

/*
 *  @desc    Get All Users
 *  @route   /api/users
 *  @method  GET
 *  @access  private (only Admin)
 */

router.get('/api/users', verifyTokenAndAdmin, getAllUsers)

/*
 *  @desc    Get User By Id
 *  @route   /api/users/:id
 *  @method  GET
 *  @access  private (only admin)
 */

router.get('/api/users/:id', verifyTokenAndAdmin, getUsersById)

/*
 *  @desc    Update User
 *  @route   /api/users/:id
 *  @method  PUT
 *  @access  private (only admin & user himself)
 */

router.put('/api/users/:id', verifyTokenAndAuthorization, updateUsers)

/*
 *  @desc    Delete User
 *  @route   /api/users/:id
 *  @method  Delete
 *  @access  private (only admin & user himself)
 */

router.delete('/api/users/:id', verifyTokenAndAuthorization, deleteUsers)

module.exports = router
