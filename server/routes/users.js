var express = require('express');
var router = express.Router();
const UserController = require('../controllers/User')
const { CheckUser } = require('../middleware/index')

// router.post('/', UserController.create)
// router.post('/login', UserController.login)
router.post('/', UserController.login)

router.post('/signin', UserController.signIn)

router.use(CheckUser)
router.get('/:id', UserController.findOne)
router.put('/:id' , UserController.update)
router.delete('/:id', UserController.delete)

module.exports = router;
