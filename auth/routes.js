const router = require("express").Router()
const User = require("./model")
const { authenticate, token, hash } = require("./lib")

router.get("/guarded", authenticate, (req, res) => res.send(req.user))

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    login: req.body.login
  })
  if (req.body.login === "admin" && req.body.password === "pass" && !user) {
    const adminNew = new User({
      login: "admin",
      password: "pass",
      isAdmin: true
    })
    await adminNew.save()
    res.send("Hi, admin")
  }

  else if (req.body.login === "admin" && req.body.password === "pass" && user) {
    res.send({
      token: token({ _id: user._id, login: user.login })
    })
  }

  else if (!user) {
    const newUser = new User({
      login: req.body.login,
      password: hash(req.body.password)
    })
    await newUser.save()
    res.send({
      token: token({ _id: newUser._id, login: newUser.login })
    })
  }

  else if (user.password !== req.body.password) {
    res.status(400).send({ message: "Ne zvoni s`uda bolshe" })
  } 
  else {
    res.send({
      token: token({ _id: user._id, login: user.login })
    })
  }
})

module.exports = router
