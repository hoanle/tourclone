
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const { generateToken, loginWithEmail } = require('./../services/authenticateService');
const { catchAsync } = require('./errorController');

exports.createUser = catchAsync(async (request, response, next) => {

    const { name, email, password, role, introduction } = request.body;
    if (!name || !email || !password || !role) {
        next(new AppError(422, 'Name, Email, Password and Role are required'))
    }

    if (role === "host") {
        if (!introduction) {
            next(new AppError(422, 'Host user must have introduction'))
        }
    }

    const user = await User.create(
        {
            name: name,
            email: email,
            password: password,
            role: role,
            introduction: introduction
        }
    )

    const token = await generateToken(user);
    response.status(200).json({
        status: 'success',
        data: { user, token }
    })
})

exports.getUserList = catchAsync(async (request, response, next) => {

    const userList = await User.find({}).limit(20);
    response.status(200).json({
        status: 'success',
        data: { userList }
    })
})

exports.getMyProfile = catchAsync(async (request, response) => {

    const user = request.user;
    response.status(200).json({
        status: 'success',
        data: { user }
    })
})

exports.updateMyProfile = catchAsync(async (request, response, next) => {

    const { name, email, password } = request.body

    const user = request.user

    if (!name && !password && !introduction) {
        next(new AppError(400, 'Not params provided'))
    }

    if (!name) {
        user.name = name;
    }

    if (!email) {
        user.email = email;
    }

    if (!password) {
        user.password = password;
    }

    user.save();

    response.status(200).json({
        status: 'success',
        data: { user }
    })
})

exports.login = catchAsync(async (request, response, next) => {

    const { email, password } = request.body
    if (!email || !password) {
        next(new AppError(400, 'Email and password are required'))
    }

    const user = await loginWithEmail(email, password);
    const token = await generateToken(user);
    response.status(200).json({
        status: 'success',
        data: { user, token }
    })
})

exports.logout = catchAsync(async (request, response) => {

    const user = request.user
    const token = request.token

    user.tokens = user.tokens.filter(el => el !== token);

    await user.save();
    return response.status(200).json({
        status: 'success',
        data: null
    })
})

exports.getUserProfile = catchAsync(async (req, response) => {

    const user = await User.findById(req.params.userId);
    if (!user) {
        next(new AppError(404, `Can't find user with id ${req.params.userId}`))
    }
    response.status(200).json({
        status: "success",
        data: { user }
    });
})