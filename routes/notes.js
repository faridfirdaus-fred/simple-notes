const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// GET /api/notes - Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
    }
});

// GET /api/notes/:id - Get a single note
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching note', error: error.message });
    }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
    try {
        const { sender, content } = req.body;
        
        if (!sender || !content) {
            return res.status(400).json({ 
                message: 'Nama pengirim dan isi note harus diisi' 
            });
        }

        const note = new Note({
            sender,
            content
        });

        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        res.status(500).json({ message: 'Error creating note', error: error.message });
    }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
    try {
        const { sender, content } = req.body;
        
        if (!sender || !content) {
            return res.status(400).json({ 
                message: 'Nama pengirim dan isi note harus diisi' 
            });
        }

        const note = await Note.findByIdAndUpdate(
            req.params.id,
            { sender, content, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        res.status(500).json({ message: 'Error updating note', error: error.message });
    }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
});

module.exports = router;