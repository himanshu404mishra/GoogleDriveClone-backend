const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    // username: String,
    // email: String,
    // password: String

    username: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [3,'username must be atleast 3 character long']
    },
    email: {
        type: String,
        rquired: true,
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [12, 'Email must be astleast 12 character long'],
    },
    password: {
        type: String,
        rquired: true,
        trim: true,
        minlength: [5, 'Password must be atleast 5 character long']
    }
})

const user = mongoose.model('user', userSchema)

module.exports = user