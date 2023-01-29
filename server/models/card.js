const mongoose = require('mongoose')

const cardSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    img: {
        data: Buffer,
        contentType: String
    }
})

module.exports = new mongoose.model('Card', cardSchema)