const express = require('express')
const mongoose = require('mongoose')
const Card = require('./models/card')
const cardRouter = require('./routers/cards')
const path = require('path')
const app = express()

mongoose.set('strictQuery', false)
mongoose.connect('mongodb://127.0.0.1:27017/cards')

app.use(express.static("public"))
app.use(express.static("dist"))

app.set('view engine', 'ejs')

app.get('/', async (req,res)=>{
    const data = await Card.find()
    res.render("home/home", {value: data})
})

app.use('/cards', cardRouter)

app.listen(5000)