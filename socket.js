const jwt = require('jsonwebtoken')
const User = require("./auth/model")

let users = {}
const SALTjwt = "reactcal"

const socket = io => {
    // middleware
    io.use((socket, next) => {
        const { token } = socket.handshake.query
        if (jwt.verify(token, SALTjwt)) {
            return next()
        }
        return next(new Error('authentication error'))
    });

    io.on("connection", async socket => {
        const { token } = socket.handshake.query;

        const userFromToken = jwt.verify(token, SALTjwt)
        const user = await User.findOne({
            _id: userFromToken._id
        });
        if (!user) {
            socket.logout()
        }
        socket.on("online", user => {
             console.log(user)
             if (user) {
                 console.log(socket.id)
                 socket.id = user.userId
                 if (users[user.userId] == undefined) {
                     users[user.userId] = { ...user, online: true }
                 }
                 else {
                     users[user.userId].online = true
                 }
             }
             console.log(users)
        })
        console.log(`Hi, we are ${users}`)
        socket.broadcast.emit('broadcast', users )
        socket.emit('broadcast', users )

        socket.on("chat message", msg => {
            io.emit("chat message", msg)
        })
        console.log(users)
        socket.on("disconnect", () => {
                // socket.broadcast.emit('broadcast', users )
                // users[user.userId].online = false
                // console.log("disconnected")
        })

    })
}
module.exports = { socket }
