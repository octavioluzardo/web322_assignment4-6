const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    roomId:{
        type: String,
        required: true
    },
    roomName: {
        type: String,
        required: true
    },
    roomLocation: {
        type: String,
        required: true
    },
    roomPrice: {
        type: Number,
        required: true
    },
});

const Book = new mongoose.model("Book", bookSchema);
module.exports = Book; 