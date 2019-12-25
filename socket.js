const jwt = require("jsonwebtoken")
const User = require("./auth/model")
const Message = require("./messages/model")

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
    console.log(socket.id)
    console.log("socket connected")
    const { token } = socket.handshake.query
    const userFromToken = jwt.verify(token, SALTjwt)

    let user = await User.findOne({
      _id: userFromToken._id
    })
    if (!user) {
      socket.logout()
      return
    }

    user = user.toObject()

    socket.id = user._id
    if (users[user._id] == undefined) {
      users[user._id] = { ...user, online: true }
    } else {
      users[user._id].online = true
    }

    let allMessages = await Message.find({}).lean()

    socket.emit("allMessages", allMessages)

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
      console.log("disconnected")
      users[user._id].online = false
      socket.broadcast.emit("broadcast", users)
      socket.emit("broadcast", users)
    })
  })
}
module.exports = { socket }
