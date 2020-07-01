var express = require('express')
var router = express.Router();
const { getReviews, createReview } = require('./../controllers/reviewController')
const { requiresLogin } = require('./../services/authenticateService')

router.route('/reviews')
    .get(getReviews)
    .post(requiresLogin, createReview)

module.exports = router