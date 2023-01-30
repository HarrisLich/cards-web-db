const express = require('express')
const User = require('./models/user')
const mongoose = require('mongoose')
const Card = require('./models/card')
const cardRouter = require('./routers/cards')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const path = require('path')
const MongoStore = require('connect-mongo')
const genPassword = require('./lib/passwordUtils').genPassword
const session = require('express-session')
const passport = require('passport')
const app = express()
const dotenv = require('dotenv').config()
const isAuth = require('./authMiddleware').isAuth

let cardsToShow = []

const sessionStore = MongoStore.create({mongoUrl: 'mongodb+srv://harrislich:WrjnOPJRzTf9tzbE@cluster0.amkrpdx.mongodb.net/?retryWrites=true&w=majority', collectionName: 'session'})

mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://harrislich:WrjnOPJRzTf9tzbE@cluster0.amkrpdx.mongodb.net/?retryWrites=true&w=majority')

app.use(methodOverride('_method'))
app.use(express.static("public"))
app.use(express.static("dist"))
require('./passport-config')
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    cardsToShow = await Card.find()
    res.render("home/home", { value: cardsToShow })
})

app.post('/', (req, res) => {
    res.redirect(`/search/${req.body.search}`)
})

app.get('/search/:search', async (req, res) => {
    let cards = await Card.find({ 'name': { "$regex": req.params.search, "$options": "i" } })
    res.render("cards/search", { value: cards })
})

app.get('/login', (req, res) => {
    res.render('home/login')
})

app.get('/register', (req, res) => {
    res.render('home/register')
})

app.post('/register', async (req, res) => {
    try{
        const saltHash = genPassword(req.body.password)
        const salt = saltHash.salt
        const hash = saltHash.hash
        console.log(hash)
        let user = new User()
        user.username = req.body.username
        user.hash = hash
        user.salt = salt
        const reigsterUser = await user.save().then((user)=>{
            console.log(user)
        })
    } catch(e){
        console.log(e)
        res.redirect('/')
    }
    res.redirect('/login')
})

app.post ("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
}))

app.get('/logout', (req,res)=>{
    console.log('user has logged out')
    req.logout(function(err){
        if(err){return next(err);}
        res.redirect('/')
    })
})

app.use('/cards', cardRouter)

app.listen(5000)