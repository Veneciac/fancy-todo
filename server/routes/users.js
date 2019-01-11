var express = require('express');
var router = express.Router();
const UserController = require('../controllers/User')

router.post('/', UserController.create)
router.post('/signin', UserController.signIn)

router.get('/:id', UserController.findOne)
router.put('/:id' , UserController.update)
router.delete('/:id', UserController.delete)

module.exports = router;
