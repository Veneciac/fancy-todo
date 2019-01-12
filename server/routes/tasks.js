var express = require('express');
var router = express.Router();
const TaskController = require('../controllers/Task')
const checkUser = require('../middleware').CheckUser

router.use(checkUser)
router.get('/', TaskController.findAll)
router.post('/', TaskController.create)
router.get('/:id' , TaskController.findOne)
router.put('/:id', TaskController.update)
router.delete('/:id', TaskController.delete)

module.exports = router;
