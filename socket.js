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

    console.log("users", users)

    socket.on("muteUser", mutedUser => {
      console.log("muted user", users[mutedUser._id])
      if (users[mutedUser._id]) {
        users[mutedUser._id].isMuted = true
      }
    })

    

    socket.on("disconnect", () => {
      console.log("disconnected")
      console.log(users[user._id]);
      delete users[user._id];

      console.log('users', users);

      socket.broadcast.emit("broadcast", users)
      socket.emit("broadcast", users)
    })
  })
}
module.exports = { socket }
