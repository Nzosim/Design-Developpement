const mongoose = require('mongoose');

const warnDB = new mongoose.Schema({
    number: Number,
    userId: String,
    reason: String,
    date: Number,
    modo: String
})

module.exports = mongoose.model('Warn', warnDB)
