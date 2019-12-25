const db = require("../db")

const Message = db.model(
  "messages",
  new db.Schema({
    userId: db.Schema.Types.ObjectId,
    text: String,
    time: Date,
  })
)

module.exports = Message