const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10;

const validator = require("email-validator");

const userScheme = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        validate: {
            validator: function (v) {
                return validator.validate(v);
            },
            message: "Invalid email"
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        validate: {
            validator: function (v) {
                return v.length > 6;
            },
            message: `Password must be longer than 6 characters!`
        },
    },
    role: {
        type: String, 
        required: [true, "User must have a role"], 
        trim: true, 
        enum: ['host', 'normal'],
    },
    introduction: {
        type: String, 
        trim: true, 
    },
    tokens: [{
        type: String
    }]
});

userScheme.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;
    delete userObject.tokens;
    return userObject
}

userScheme.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
})

const User = mongoose.model('User', userScheme);
module.exports = User;