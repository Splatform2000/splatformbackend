const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
