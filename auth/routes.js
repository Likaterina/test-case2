const router = require("express").Router()
const User = require("./model")
const { authenticate, token, hash, signUp } = require("./lib")

router.get("/", ({ session: { user }}, res) => res.send({ user }))

router.post("/", async (req, res) => {

  await Joi.validate({ login, password}, signUp)

  const user = await User.findOne({
    login: req.body.login,
  })

  const sessionizeUser = user => {
    return { _id: user._id, login: user.login };
  }

  if (req.body.login === "admin" && req.body.password === "pass" && !user) {
    const adminNew = new User({
      login: "admin",
      password: "pass",
      isAdmin: true
    })
    await adminNew.save()
    res.send("Hi, admin")
  }

  if (req.body.login === "admin" && req.body.password === "pass" && user) {
    req.session.user = sessionizeUser(user)
    res.send(sessionizeUser(user))
  }

  if (!user) {
    const newUser = new User({
      login: req.body.login,
      password: req.body.password
    })
    await newUser.save()
    res.send(`Hi, new User ${newUser.login}!`)
  }

  if (user.password !== hash(req.body.password)) {
    res.status(400).send({ message: "Ne zvoni s`uda bolshe" })
  }

  else {
    req.session.user = sessionizeUser(user)
    res.send(sessionizeUser(user))
  }
})

router.delete("/", ({ session }, res) => {
  const user = session.user
  if (user) {
    session.destroy(err => {
      if (err) {
        throw (err)
      }
      res.clearCokie('user_sid')
      res.send(user)
    })
  } 
  else {
    throw new Error('Nope')
  }
})


module.exports = router