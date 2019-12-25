const jwt = require("jsonwebtoken")
const User = require("./auth/model")
const Message = require('./messages/model')

let users = {}
const SALTjwt = "reactcal"

const socket = io => {

  io.use((socket, next) => {
    const { token } = socket.handshake.query
    if (jwt.verify(token, SALTjwt)) {
      return next()
    }
    return next(new Error("authentication error"))
  })

  io.on("connection", async socket => {
    const { token } = socket.handshake.query
    const userFromToken = jwt.verify(token, SALTjwt)

    let user = await User.findOne({
      _id: userFromToken._id
    })
    if (!user) {
      socket.logout()
      console.log("user not logged in")
      return
    }

    user = user.toObject()

    socket.id = user._id
    if (users[user._id] == undefined) {
      users[user._id] = { ...user, online: true }
    } else {
      users[user._id].online = true
    }
    console.log(`Hi, we are ${users}`)

    let allMessages = await Message.find({}).lean()
    
    console.log("All of them", allMessages)
    socket.broadcast.emit("allMessages", allMessages)

    socket.broadcast.emit("broadcast", users)
    socket.emit("broadcast", users)

    socket.on("message", async msg => {
      const message = new Message({
        userId: user._id,
        text: msg.text
      })
      await message.save()

      socket.broadcast.emit("message", message)
    })



    socket.on("disconnect", () => {
      users[user._id].online = false
      socket.broadcast.emit("broadcast", users)
      socket.emit("broadcast", users)
      console.log("disconnected")
    })
  })
}
module.exports = { socket }
