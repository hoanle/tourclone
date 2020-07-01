const moongose = require('mongoose')

const opts = { toJSON: { virtuals: true } };

const experienceSchema = moongose.Schema({
    host: {
        type: moongose.Schema.ObjectId,
        ref: 'User', 
        required: [true, 'host is required']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true, 
    },
    duration: {
        type: Number, 
    },
    groupSize: {
        type: Number
    },
    images: [{ 
        type: String 
    }],
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    items: [{
        type: String
    }], 
    price: {
        type: Number, 
    },
    country: {
        city: {
            type: String
        }, 
        country: {
            type: String
        }
    }, 
    tags: [{
        type: moongose.Schema.ObjectId,
        ref: 'Tag'
    }]
}, opts)

experienceSchema.methods.toJSON = function () {
    const experience = this;
    const experienceObject = experience.toObject();
    delete experienceObject.__v;
    delete experienceObject.tokens;
    return experienceObject
}

const Experience = moongose.model('Experience', experienceSchema)

module.exports = Experience