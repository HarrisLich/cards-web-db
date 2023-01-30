const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
})

module.exports = mongoose.model('User', userSchema)