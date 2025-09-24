const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: [true, 'Nama pengirim harus diisi'],
        trim: true,
        maxlength: [100, 'Nama pengirim maksimal 100 karakter']
    },
    content: {
        type: String,
        required: [true, 'Isi note harus diisi'],
        trim: true,
        maxlength: [1000, 'Isi note maksimal 1000 karakter']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update updatedAt field before saving
noteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Note', noteSchema);