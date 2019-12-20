const app = require('express')()
const http = require('http').createServer(app)
const bodyParser = require("body-parser")
const session = require('express-session')
const morgan = require("morgan")
const cookieParser = require('cookie-parser')
const path = require("path")

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

app.use("/auth", authRouter)


app.get('/', (req, res) => {
    res.send('lol_kek')
})

app.get("/title", (req, res) => {
    res.send({ title: "Ne zvoni s`uda bolshe" })
  })

http.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})