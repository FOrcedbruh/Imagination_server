const { Schema, model} = require('mongoose');


const Note = Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    }
})

module.exports = model('Note', Note);