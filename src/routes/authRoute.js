var express = require('express')
var router = express.Router();
const { loginFacebook, facebookAuthHandler } = require('./../controllers/authController')

router.get("/auth/facebook/login", loginFacebook);
router.get("/auth/facebook/authorized", facebookAuthHandler);

module.exports = router