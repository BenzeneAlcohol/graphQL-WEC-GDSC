const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;