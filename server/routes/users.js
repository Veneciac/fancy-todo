var express = require('express');
var router = express.Router();
const UserController = require('../controllers/User')
const checkUser = require('../middleware').checkUser

router.post('/', UserController.create)
router.post('/signin', UserController.signIn)
router.post('/login', UserController.logIn)

router.use(checkUser)
router.get('/:id', UserController.findOne)
router.put('/:id' , UserController.update)
router.delete('/:id', UserController.delete)

module.exports = router;
