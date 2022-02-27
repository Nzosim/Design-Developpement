const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: String,
    money: {
        type: Number,
        min: 0
    },
    xp: {
        type: Number,
        min: 0
    },
    daily: Date,
    roulette: Date
})

module.exports = mongoose.model('Users', schema)