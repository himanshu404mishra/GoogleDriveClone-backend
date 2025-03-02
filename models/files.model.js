const mongoose = require("mongoose")


const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: [true, 'Path is required']
    },
    originalName: {
        type: String,
        required: [true, 'Original is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'User is required']
    }
})

module.exports = mongoose.model('files', fileSchema)