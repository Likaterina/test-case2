const db = require('../db')

const User = db.model(
    "users",
    new db.Schema({
        login: {
            type: String,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean
        },
        online: {
            type: Boolean
        }
    })
)

module.exports = User