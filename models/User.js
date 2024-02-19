const { Schema, model } = require('mongoose');
const Note = require('./Note');




const User = Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    }
})

module.exports = model('User', User);

