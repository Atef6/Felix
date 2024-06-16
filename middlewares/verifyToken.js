const jwt = require('jsonwebtoken')

// Verify Token
function VerifyToken(req, res, next) {
    const token = req.headers.token
    if (token) {
        try {
            const decode = jwt.verify(token, process.env.JWTKey)
            req.user = decode
            next()
        } catch (error) {
            res.status(401).json({ message: "invalid token" });
        }
    } else {
        res.status(401).json({ message: "no token provided" });
    }
}
// Verify Token & Authorize the user
function verifyTokenAndAuthorization(req, res, next) {
    VerifyToken(req, res, () => {
        if (req.user.id === req.user.params.id || req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({ message: "you are not allowed" });
        }
    })
}
// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
    VerifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({ message: "you are not allowed,only admin allowed" });
        }
    })
}
module.exports = {
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization,
    VerifyToken,
}