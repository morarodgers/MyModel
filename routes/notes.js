const express = require('express')
const router = express.Router()

const {
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote
} = require('../controllers/notes')

router.route('/').post(createNote).get(getAllNotes)
router.route('/:id').get(getNote)
router.route('/:id').delete(deleteNote)
router.route('/:id').patch(updateNote)

module.exports = router