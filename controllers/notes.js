const Note = require("../models/note");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllNotes = async (req, res) => {
  const notes = await Note.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ notes, count: notes.length });
};

const getNote = async (req, res) => {
  const {
    user: { userId },
    params: { id: noteId },
  } = req;

  const note = await Note.findOne({
    _id: noteId,
    createdBy: userId,
  });
  if (!note) {
    throw new NotFoundError(`No note with id ${noteId}`);
  }
  res.status(StatusCodes.OK).json({ note });
};

const createNote = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const note = await Note.create(req.body);
  res.status(StatusCodes.CREATED).json({ note });
};

const updateNote = async (req, res) => {
  const {
    body: { title, subject },
    user: { userId },
    params: { id: noteId },
  } = req;

  if (title === "" || subject === "") {
    throw new BadRequestError("Title or subject fields cannot be empty");
  }
  const note = await Note.findByIdAndUpdate(
    { _id: noteId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!note) {
    throw new NotFoundError(`No note with id ${noteId}`);
  }
  res.status(StatusCodes.OK).json({ note });
};

const deleteNote = async (req, res) => {
  const {
    user: { userId },
    params: { id: noteId },
  } = req;

  const note = await Note.findByIdAndRemove({
    _id: noteId,
    createdBy: userId,
  });
  if (!note) {
    throw new NotFoundError(`No note with id ${noteId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "The note was deleted." });
};

module.exports = {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
