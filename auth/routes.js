const router = require("express").Router()
const User = require("./model")
const { authenticate, token, hash } = require("./lib")

router.get("/guarded", authenticate, (req, res) => res.send(req.user))

router.post("/login", async (req, res) => {
    const user = await User.findOne({
      login: req.body.login,
      password: hash(req.body.password)
    }) 
    if (!user) {
      res.status(400).send({ message: "Ne zvoni s`uda bolshe" })
    }
    res.send({
      token: "Bearer " + token({ _id: user._id, login: user.login })
    })
  })

router.post("/register", async (req, res) => {
    const user = new User({
        login: req.body.login,
        password: hash(req.body.password)
    })
    await user.save()
    res.send({ lol: "kek" })
})

module.exports = router