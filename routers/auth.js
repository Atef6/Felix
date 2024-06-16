const express = require('express')
const { register, login } = require('../controllers/authController')
const router = express.Router()

/*
 *  @desc    Register New User
 *  @route   /auth/singup
 *  @method  POST
 *  @access  public
 */

router.post('/auth/singup', register)

/*
 *  @desc    Login User
 *  @route   /auth/singin
 *  @method  POST
 *  @access  public
 */

router.post('/auth/singin', login)

module.exports = router