var express = require('express');
var router = express.Router();
const UserController = require('../controllers/User')
const { CheckUser } = require('../middleware/index')

router.post('/', UserController.regis)
router.post('/signin', UserController.signIn)
// router.post('/login', UserController.logIn)

router.use(CheckUser)
router.get('/:id', UserController.findOne)
router.put('/:id' , UserController.update)
router.delete('/:id', UserController.delete)

module.exports = router;
