const Tag = require('./../models/tagModel');
const AppError = require('./../utils/appError');
const { catchAsync } = require('./errorController');

exports.createTag = catchAsync(async (request, response, next) => {

    const tag = request.body.tag
    if (!tag) {
        next(new AppError(422, 'Tag is required'))
    }
    let tagInDb = await Tag.findOne({ tag: tag })
    if (!tagInDb) {
        tagInDb = await Tag.create({
            tag: tag
        })
    }

    response.status(200).json({
        status: 'success',
        data: { tagInDb }
    })
})

exports.getTagList = catchAsync(async (request, response, next) => {

    const tagList = await Tag.find({});
    response.status(200).json({
        status: 'success',
        data: { tagList }
    })
})

exports.getExperienceFromTag = async (request, response, next) => {

    const tagList = await Tag.find({ _id: request.params.tagId })
    response.status(200).json({
        status: 'success',
        data: { tagList }
    })
}