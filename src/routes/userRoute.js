var express = require('express')
var router = express.Router();
const { getUserList, createUser, login, logout, updateMyProfile, getUserProfile, getMyProfile } = require('./../controllers/userController')
const { requiresLogin, requiresHost } = require('./../services/authenticateService')
const { getMyExperiences } = require('./../controllers/experienceController')

router
    .route("/users")
    .get(getUserList)

router
    .route("/auth/register")
    .post(createUser)

router
    .route("/auth/login")
    .post(login)

router
    .route("/auth/logout")
    .post(requiresLogin, logout)

router
    .route("/me")
    .get(requiresLogin, getMyProfile)
    .put(requiresLogin, updateMyProfile)
router
    .route('/me/experiences')
    .get(requiresLogin, requiresHost, getMyExperiences) //Get all my experiences

router
    .route("/users/:userId")
    .get(requiresLogin, getUserProfile)

module.exports = router;