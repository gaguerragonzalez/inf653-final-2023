const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');

router.route('/')
    .get(statesController.getAllStates)

router.route('/:state')
    .get(verifyStates, statesController.getState);

module.exports = router;