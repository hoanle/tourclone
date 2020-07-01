const passport = require("./../passport/index")
const User = require('./../models/userModel')

exports.loginFacebook = passport.authenticate("facebook", { scope: ['email'] });
exports.loginGoogle = passport.authenticate("google", { scope: ['profile', 'email'] });

exports.facebookAuthHandler = (request, response, next) => {
    passport.authenticate("facebook", async (err, profile) => {
        if (err) {
            return response.status(400).json({
                status: 'fail',
                message: err.message
            })
        }
        const { email, last_name, first_name } = profile._json
        const user = await User.findOneOrCreate(email, `${first_name} ${last_name}`)
        const token = await user.generateToken()
        response.status(200).json({
            status: 'success',
            data: { user, token }
        })
    })(request, response, next);
} 

exports.googleAuthHandler = (request, response, next) => {
    passport.authenticate("google", async (err, profile) => {
        if (err) {
            return response.status(400).json({
                status: 'fail',
                message: err.message
            })
        }
        const { email, name } = profile._json
        const user = await User.findOneOrCreate(email, name)
        const token = await user.generateToken()
        response.status(200).json({
            status: 'success',
            data: { user, token }
        })
    })(request, response, next);
} 