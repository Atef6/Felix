const mongoose = require('mongoose');
const { User } = require('../modules/User')

async function checkUser(req, res, next) {
    const id = req.body.user || req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json('Invalid user ID.');
    }
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json('User not found.');
    }
    req.user = user;
    next();
}

module.exports = { checkUser }