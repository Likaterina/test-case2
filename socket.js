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
    const userFromToken = jwt.decode(token, SALTjwt)

    let user = await User.findOne({
      _id: userFromToken._id
    })

    console.log('user', user);
    if (!user) {
      socket.logout()
      return
    }

    user = user.toObject()
    console.log(user.login)
    socket.id = user._id
    
    users[user._id] = user

    let allMessages = await Message.find({}).lean()

    socket.emit("allMessages", allMessages)

    socket.broadcast.emit("broadcast", users)
    socket.emit("broadcast", users)

    socket.on("message", async msg => {
      console.log(user.login)
      const message = new Message({
        userId: user._id,
        text: msg.text,
        userName: user.login
      })
      await message.save()

      socket.broadcast.emit("message", message)
    })

    socket.on("disconnect", () => {
      console.log("disconnected")
      console.log('user._id', user._id);
      console.log(users[user._id]);
      delete users[user._id];

      console.log('users', users);

      socket.broadcast.emit("broadcast", users)
      socket.emit("broadcast", users)
    })
  })
}
module.exports = { socket }
