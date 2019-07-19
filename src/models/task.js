// Developed by Carlos Mejia - 2019
// www.carlosmariomejia.com
const mongoose = require('mongoose');
const validator = require('validator');

const Task = mongoose.model('task', {
    description: {
        type: String,
        required: true
    }, completed: {
        type: Boolean,
        default: false
    }
});

module.exports = Task;