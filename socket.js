const jwt = require('jsonwebtoken')

let users = {}

const socket = io => {
    io.on("connection", socket => {
        console.log("connected")
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

        socket.broadcast.emit('broadcast', { description: users })

        socket.on("chat message", msg => {
            io.emit("chat message", msg)
        })

        socket.on("disconnect", () => {
                socket.broadcast.emit('broadcast', { users })
                users[user.userId].online = false
                console.log("disconnected")
        })

    })
}
module.exports = { socket }
