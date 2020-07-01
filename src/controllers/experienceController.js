const Experience = require('./../models/experienceModel');
const Tag = require('./../models/tagModel')
const AppError = require('./../utils/appError');
const { catchAsync } = require('./errorController');

exports.createExperience = catchAsync(async (request, response, next) => {

    const { title, description, duration,
        groupSize, images, items,
        price, country, tags } = request.body

    if (!title || !description) {
        next(new AppError(400, 'Title and description are required'))
    }
    const experience = new Experience()
    experience.title = title
    experience.description = description
    experience.host = request.user._id

    if (duration) {
        experience.duration = duration
    }
    if (groupSize) {
        experience.groupSize = groupSize
    }
    if (images) {
        experience.images = images
    }
    if (items) {
        experience.items = items
    }
    if (price) {
        experience.price = price
    }
    if (country) {
        experience.country = country
    }
    if (tags) {
        experience.tags = await Tag.generateTags(tags)
    }

    await experience.save()
    await experience.populate('tags', 'tag')
        .execPopulate();
    response.status(200).json({
        status: 'success',
        data: { experience }
    })

})

exports.getMyExperiences = catchAsync(async (request, response, next) => {

    const myExperiences = await Experience.find({ host: request.user._id })
    response.status(200).json({
        status: 'success',
        data: { myExperiences }
    })

})

exports.updateExperience = async (request, response) => {

    const { title, description, duration, groupSize, images, items, price, country, tags } = request.body
    if (!title && !description && !duration
        && !groupSize && !images && !items
        && !price && !country && !tags) {
        return response.status(400).json({
            status: 'fail',
            message: 'Params is missing'
        })
    }

    const experience = request.experience
    console.log(`update ${experience}`)
    if (title) {
        experience.title = title
    }

    if (description) {
        experience.description = description
    }

    if (duration) {
        experience.duration = duration
    }
    if (groupSize) {
        experience.groupSize = groupSize
    }
    if (images) {
        experience.images = images
    }
    if (items) {
        experience.items = items
    }
    if (price) {
        experience.price = price
    }
    if (country) {
        experience.country = country
    }
    if (tags) {
        experience.tags = tags
    }
    await experience.save()

    response.status(200).json({
        status: 'success',
        data: { experience }
    })
}

exports.showExperience = async (request, response) => {

    const experienceId = request.params.experienceId
    if (!experienceId) {
        return response.status(400).json({
            status: 'fail',
            message: 'Experience id is required'
        })
    }
    const experience = await Experience.findById(experienceId)

    if (!experience) {
        return response.status(400).json({
            status: 'fail',
            message: 'Experience id is not existed'
        })
    }
    await experience.populate({
        path: 'host',
        select: '_id name'
    }).populate({
        path: 'tags',
        select: '_id tag'
    }).execPopulate()

    response.status(200).json({
        status: 'success',
        data: { experience }
    })
}

exports.getExperiences = async (request, response) => {

    const tag = request.query.tag
    let experienceList;

    if (tag) {
        let tagObject = await Tag.findOne({ tag: decodeURI(tag).toLowerCase().trim() })

        if (!tagObject) {
            return response.status(200).json({
                status: 'success',
                data: { experienceList: [] }
            })
        }

        experienceList = await Experience.find({ tags: tagObject._id }).populate('tags', 'tag').limit(20)
    } else {
        experienceList = await Experience.find({}).populate('tags', 'tag').populate('host', 'name').limit(20)
    }

    response.status(200).json({
        status: 'success',
        data: { experienceList }
    })
}

exports.deleteExperience = async (request, response) => {

    const experience = request.experience
    await experience.remove()
    response.status(200).json({
        status: 'success',
        data: null
    })
}