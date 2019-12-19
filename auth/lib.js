const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const SALTjwt = 'reactcal'

const token = obj => jwt.sign(obj, SALTjwt)

const decode = token => {
    return new Promise((resolve,reject) => {
        jwt.verify(token, SALTjwt, (err, docoded) => {
            if (err) {
                reject (err)
            } 
            resolve (decoded)
        })
    })
}

const SALT = 'asslist'

const hash = password => {
    crypto
        .createHash('sha256')
        .update(password + SALT)
        .digest("base64")
}

const authenticate = async (req, res, next) => {
    const authorization = req.get("Authorezation")
    if (!authorization) {
        res.status(403).end()
        return
      }
      const token = authorization.split(" ")[1]
      try {
        const decoded = await decode(token)
        req.user = decoded
        next()
      } catch (error) {
        res.status(403).end()
      }
}

module.exports = { token, hash, authenticate }