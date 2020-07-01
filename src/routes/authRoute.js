var express = require('express')
var router = express.Router();
const { loginFacebook, facebookAuthHandler, loginGoogle, googleAuthHandler } = require('./../controllers/authController')

router.get("/auth/facebook/login", loginFacebook);
router.get("/auth/facebook/authorized", facebookAuthHandler);

router.get("/auth/google/login", loginGoogle);
router.get("/auth/google/authorized", googleAuthHandler);


module.exports = router