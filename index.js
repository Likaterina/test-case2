const app = require('express')()
const http = require('http').createServer(app)
const morgan = require("morgan")
const path = require("path")


const port = 3228

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