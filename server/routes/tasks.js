var express = require('express');
var router = express.Router();
const TaskController = require('../controllers/Task')
const { CheckUser ,checkPerson } = require('../middleware/index')

router.use(CheckUser)
router.get('/', TaskController.findAll)
router.post('/', TaskController.create)
router.get('/:id' , TaskController.findOne)
router.put('/:id', TaskController.update)

// router.use(checkPerson)
router.delete('/:id', TaskController.delete)

module.exports = router;
