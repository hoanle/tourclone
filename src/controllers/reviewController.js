const Review = require('./../models/reviewModel')
const Experience = require('./../models/experienceModel')
const AppError = require('./../utils/appError');
const { catchAsync } = require('./errorController');

exports.getReviews = catchAsync(async (request, response, next) => {

    const experienceId = request.query.experienceId
    if (!experienceId) {
        next(new AppError(400, 'Experience id is required'))
    }

    const experience = await Experience.findOne({ _id: experienceId })
    if (!experience) {
        next(new AppError(400, 'Invalid experience id'))
    }
    const reviewList = await Review.find({ experience: experienceId }).populate('user', 'name')
    response.status(200).json({
        status: 'success',
        data: { reviewList }
    })
})

exports.createReview = catchAsync(async (request, response, next) => {

    const { comment, rating, experienceId } = request.body
    console.log(`id ${experienceId}`)
    if (!rating || !experienceId) {
        next(new AppError(400, 'Rating or experience is require'))
    }
    const experience = await Experience.findOne({ _id: experienceId });
    if (!experience) {
        next(new AppError(400, `Can not find experience with id ${experienceId}`))
    }

    const review = await Review.findOneAndUpdate(
        { experience: experienceId, user: request.user._id },
        { comment: comment, rating: rating },
        { upsert: true, new: true, runValidators: true })
        .populate('user', 'name')
        .populate('experience', 'title description')
    response.status(200).json({
        status: 'success',
        data: { review }
    })
})