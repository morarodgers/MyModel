const  Note = require('../models/note')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllNotes = async(req, res) => {
    res.send('get all notes')
}

const getNote = async(req, res) => {
    res.send('get one note')
}

const createNote = async(req, res) => {
    //res.send('create a job')
    req.body.createdBy = req.user.userId
    const note = await Note.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateNote = async(req, res) => {
    res.send('update a note')
}

const deleteNote = async(req, res) => {
    res.send('delete a note')
}

module.exports = {
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
}