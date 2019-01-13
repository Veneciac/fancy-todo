var express = require('express');
var router = express.Router();
const SpeechController = require('../controllers/Speech')
const { CheckUser } = require('../middleware/index')

router.use(CheckUser)
router.get('/', SpeechController.read)

module.exports = router;
