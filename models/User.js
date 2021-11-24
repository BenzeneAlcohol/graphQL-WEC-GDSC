const mongoose = require('mongoose');
const Employee = require('./Employee')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEmployees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }]
})

const User = mongoose.model('User', userSchema);
module.exports = User;