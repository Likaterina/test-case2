const router = require("express").Router()
const User = require("./model")
const { authenticate, hash } = require("./lib")

router.get("/get-current-user", authenticate, (req, res) => {
  res.send(req.session.user)
})

router.get("/", ({ session: { user } }, res) => res.send({ user }))

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    login: req.body.login,
  })

  const sessionizeUser = user => {
    return {
      _id: user._id,
      login: user.login
    }
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
      password: hash(req.body.password)
    })
    await newUser.save()
    res.send(`Hi, new User ${newUser.login}!`)
  }
  console.log(user)
  if (user.password !== hash(req.body.password)) {
    res.status(400).send({ message: "Ne zvoni s`uda bolshe" })
  }

  else {
    req.session.user = sessionizeUser(user)
    res.send(sessionizeUser(user))

  }
})

router.delete("/logout", ({ session }, res) => {
  console.log(session)
  const user = session.user
  if (user) {
    session.destroy(err => {
      if (err) {
        throw (err)
      }
      res.clearCookie('user_sid')
      res.send(user)
    })
  }
  else {
    res.status(422).send('Unbelievable! It`s a biblical miracle!');
  }
})


module.exports = router