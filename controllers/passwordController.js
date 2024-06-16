const asyncHandler = require("express-async-handler");
const { User } = require('../modules/User')
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

module.exports.sendForgotPasswordLink = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordCode = code;
    await user.save();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        }
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: "Reset Password",
        subject: "Reset Password Code",
        html: `<div>
              <h4>Your reset password code is:</h4>
              <p>${code}</p>
          </div>`
    }
    transporter.sendMail(mailOptions, function (error, success) {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        } else {
            console.log("Email sent: " + success.response);
            res.status(200).json({ message: "Code sent successfully" });
        }
    });
});


module.exports.resetPasswordWithCode = asyncHandler(async (req, res) => {
    const { email, code, newPassword } = req.body;

    // Find the user by email and reset password code
    const user = await User.findOne({ email, resetPasswordCode: code });

    if (!user) {
        return res.status(404).json({ message: "Invalid code or user not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and remove the reset password code
    user.password = hashedPassword;
    user.resetPasswordCode = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
});