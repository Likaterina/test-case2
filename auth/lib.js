const Joi = require('joi')

const username = Joi.string().alphanum().min(3).max(30).required()

const password = Joi.string()
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
  .options({
    language: {
      string: {
        regex: {
          base: message
        }
      }
    }
})

const signUp = Joi.object().keys({
  email,
  username,
  password
})

const signIn = Joi.object().keys({
  email,
  password
})

const authenticate = async (req, res, next) => {
    const authorization = req.get("Authorization")
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

module.exports = { token, hash, authenticate, signIn, signUp }