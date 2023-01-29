const express = require('express')
const Card = require('./../models/card')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})


const upload = multer({ storage: storage })



router.get('/new', (req,res)=>{
    res.render('./../views/cards/newCard.ejs')
})

router.use('/edit/:id', async (req,res)=>{
    const id = req.params.id
    const editCard = await Card.findById(id)
    res.render('./../views/cards/edit', { value: editCard })
})

router.post('/new', upload.single('file'), async (req,res)=>{
    try{
        const newCard = new Card({
            name: req.file.filename,
            description: req.body.description,
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



module.exports = router