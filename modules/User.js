const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const passwordComplexity = require("joi-password-complexity");

const userSchame = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 200,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 100,
        validate: {
            validator: (value) => {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re)
            },
            message: "Please enter a valid email address"
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 8,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    profilePic: {
        type: String,
        default: "default-avatar.png"
    },
    resetPasswordCode: {
        type: String
    }
}, { timestamps: true })

userSchame.methods.generateToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWTKey)
}

// ! Validate Register User
function validateRegisterUser(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(3).max(100).required(),
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: passwordComplexity().required(),
        profilePic: Joi.string().trim(),
    })
    return schema.validate(obj)
}
// ! Validate Login User
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(8).required(),
    })
    return schema.validate(obj)
}
// ! Validate Update User
function validateUpdateUser(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(3).max(100),
        email: Joi.string().trim().min(5).max(100).email(),
        password: Joi.string().trim().min(8),
        profilePic: Joi.string().trim(),
    })
    return schema.validate(obj)
}

// ! Validate Change Password
function validateChangePassword(obj) {
    const schema = Joi.object({
        password: Joi.string().trim().min(8).required(),
    });
    return schema.validate(obj);
}

const User = mongoose.model("User", userSchame)

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateChangePassword,
}