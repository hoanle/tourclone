var express = require('express')
var router = express.Router();

const { requiresLogin, requiresHost } = require('./../services/authenticateService')
const { createTag, getTagList, getExperienceFromTag } = require('./../controllers/tagController')

router.route('/tags')
    .get(getTagList)
    .post(requiresLogin, requiresHost, createTag)
    
module.exports = router