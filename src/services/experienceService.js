const Experience = require('./../models/experienceModel')

exports.isMyExperience = async (request, response, next) => {
    const id = request.params.experienceId 
    const experience = await Experience.findOne({host: request.user._id, _id: id});
    if (!experience) {
        throw new Error('Unauthorize to update experience')
    }
    request.experience = experience
    next();
}