const crypto = require('crypto')

const SALT = 'asslist'

const hash = password => {
    return crypto
        .createHash('sha256')
        .update(password + SALT)
        .digest("base64")
}

const authenticate = async (req, res, next) => {
    const authorization = req.session.user
    if (!authorization) {
        res.status(403).end()
        return
      }
    next()
}

module.exports = { hash, authenticate }