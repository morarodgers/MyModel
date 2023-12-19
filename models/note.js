const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: [true, 'Please provide a title for the Note']
    },
    subject: {
        type: String,
        required: [true, 'Please enter the subject of your Note']
    },
    content: {
        type: String,
        required: [true, 'Please enter the contents of your Note']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide name of author']}
}, {timestamps: true})

module.exports = mongoose.model('Note', NoteSchema)