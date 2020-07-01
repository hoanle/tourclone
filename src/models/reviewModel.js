const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, 'Review must belong to a creator']
    },
    experience: {
        type: mongoose.Schema.ObjectId,
        ref: 'Experience',
        require: [true, 'Review must belong to an experience']
    },
    rating: {
        type: Number, 
        require: [true, 'Must rate the experience'],
        min: 1, 
        max: 5
    },
    comment: {
        type: String
    }
})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review