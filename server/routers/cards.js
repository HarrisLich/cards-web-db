const express = require('express')
const Card = require('./../models/card')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const isAuth = require('./../authMiddleware').isAuth


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})


const upload = multer({ storage: storage })



router.get('/new', isAuth, (req,res)=>{
    res.render('./../views/cards/newCard.ejs')
})

router.get('/edit/:id', isAuth, async (req,res)=>{
    const id = req.params.id
    const editCard = await Card.findById(id)
    res.render('./../views/cards/edit', { value: editCard })
})

router.get('/:id', async (req,res)=>{
    const card = await Card.findById(req.params.id)
    if(card == null) res.redirect('/')
    res.render('./../views/cards/show', { value: card })
})

router.put('/:id', upload.single('file'), async (req,res)=>{
    req.card = await Card.findById(req.params.id)
    let card = req.card
    card.name = req.body.name
    card.description = req.body.description
    card.stock = req.body.stock
    if(req.file){
        card.img = {
            data: req.file.filename,
            contentType: 'image/png/jpeg'
        }
        card.filename = req.file.filename
    }
    await card.save()
    res.redirect('/')
})

router.post('/new', upload.single('file'), async (req,res)=>{
    try{
        const newCard = new Card({
            name: req.body.name,
            filename: req.file.filename,
            description: req.body.description,
            stock: req.body.stock,
            img: {
                data: req.file.filename,
                contentType: 'image/png/jpeg'
            }
        })
        newCard.save().catch(err=>console.log(err))
        res.redirect('/')
        console.log("Card Successfully Saved to DB")
    }catch(e){
        console.log(e)
    }
})

router.delete("/:id", isAuth, async (req,res)=>{
    try{
        const deleteCard = await Card.findByIdAndDelete(req.params.id)
        fs.unlink(__dirname + "/../public/uploads/" + deleteCard.filename, (err)=>{
            if(err){
                console.log(err)
            }
            console.log("file successfully deleted")
        })
        res.redirect('/')
        console.log("Successfully deleted card")

    }catch(e){
        console.log(e)
    }
})



module.exports = router