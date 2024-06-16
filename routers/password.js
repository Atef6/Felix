const express = require('express')
const { sendForgotPasswordLink, resetPasswordWithCode ,} = require('../controllers/passwordController')
const router = express.Router()

/**
 *  @desc    Send Forgot Password Link
 *  @route   /password/forgot-password
 *  @method  POST
 *  @access  private
 */

router.post('/password/forgot-password', sendForgotPasswordLink)

/**
 *  @desc    Reset Password using Code
 *  @route   /password/reset-password
 *  @method  POST
 *  @access  private
 */

router.post('/password/reset-password', resetPasswordWithCode)

/**
 *  @desc    Reset Password using Code
 *  @route   /verify-reset-code
 *  @method  POST
 *  @access  private
 */



module.exports = router