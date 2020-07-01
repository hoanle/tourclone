var express = require('express')
var router = express.Router();
const { requiresLogin, requiresHost } = require('./../services/authenticateService')
const { createExperience, getExperiences, updateExperience, 
    showExperience, deleteExperience } = require('./../controllers/experienceController')
const { isMyExperience } = require('./../services/experienceService');

router.route('/experiences')
    .post(requiresLogin, requiresHost, createExperience) //Create an experience
    .get(getExperiences) //Get all experience from tag

router.route('/experiences/:experienceId')
.put(requiresLogin, requiresHost, isMyExperience, updateExperience) // Update an experience
.delete(requiresLogin, requiresHost, isMyExperience, deleteExperience) //Delete an experience
.get(showExperience) //View experience

module.exports = router;