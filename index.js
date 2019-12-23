const app = require('express')()
const http = require('http').createServer(app)
const bodyParser = require("body-parser")
const session = require('express-session')
const morgan = require("morgan")
const cookieParser = require('cookie-parser')
const path = require("path")
const io = require('socket.io')(http)

const PORT = 3228

app.use(bodyParser.json())

app.use(morgan("tiny"))

app.use(cookieParser())

app.use(session({
    key: 'user_sid',
    secret: 'lolkek',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

const authRouter = require("./auth/routes")
const messageRouter = require("./messages/routes")

app.use("/auth", authRouter)
app.use("/massages", messageRouter)

app.get('/', (req, res) => {
    res.send('lol_kek')
})

app.get("/title", (req, res) => {
    res.send({ title: "Ne zvoni s`uda bolshe" })
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname +"../react-test-case/public/index.html"))
})

io.on('connection', socket => console.log('connected'))

http.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})