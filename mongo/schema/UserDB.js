const mongoose = require('mongoose');

const UserDB = new mongoose.Schema({
    userId: String,
    name: String,
    money: {
        type: Number,
        min: 0,
        default: 0
    },
    xp: {
        type: Number,
        min: 0,
        default: 0
    },
    level: {
        type: Number,
        min: 0,
        default: 0
    },
    invite: {
        type: Number,
        min: 0,
        default: 0
    },
    inviter : String,
    daily: Date,
    roulette: Date
})

module.exports = mongoose.model('Users', UserDB)