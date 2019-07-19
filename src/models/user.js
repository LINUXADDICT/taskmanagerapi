// Developed by Carlos Mejia - 2019
// www.carlosmariomejia.com
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    }, age: {
        type: Number,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid');
            }
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain the word password');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

//findByCredentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};

//Generate AuthToken
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString() }, 'carlosmejia');
    user.tokens = user.tokens.concat({ token: token });
    await user.save();
    return token;
};


// Hash plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    //console.log('Before saving');

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    // waits until finishing the previous process
    next ();
});

const User = mongoose.model('User', userSchema);

module.exports = User;