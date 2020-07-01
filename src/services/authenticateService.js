const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./../models/userModel')

exports.loginWithEmail = async (email, password) => {
   const user = await User.findOne({ email: email});
   console.log(`user ${user}`)
    if (!user) {
        throw new Error(`Can not find user with email ${email}`)
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw new Error(`Password is incorrect`)
    }
    return user;
}

exports.requiresHost = async (request, response, next) => {
    const user = request.user 
    if (user.role !== 'host') {
        return response.status(401).json({
            status: 'fail', 
            message: 'Unauthorized'
        })
    }
    next()
}

exports.requiresLogin = async (request, response, next) => {
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer')) {
        return response.status(401).json({
            status: 'fail',
            message: 'Unauthorized'
        })
    }

    const token = authorization.replace("Bearer ", "")
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decode._id, tokens: token })
        if (!user) throw new Error('Unauthorized')
        request.user = user
        request.token = token
        next()
    } catch (error) {
        return response.status(401).json({
            status: 'fail',
            message: error.message
        })
    }
}