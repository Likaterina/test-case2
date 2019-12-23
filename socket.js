const socket = io => {
  io.on("connection", socket => console.log("connected"))
}

module.exports = { socket }
