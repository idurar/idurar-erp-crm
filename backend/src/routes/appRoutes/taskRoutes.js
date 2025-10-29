const express = require('express');
const router = express.Router();
const taskController = require('@/controllers/appControllers/taskController');

// Task routes
router.route('/project/:projectId')
  .get(taskController.list);

router.route('/')
  .post(taskController.create);

router.route('/:id')
  .get(taskController.read)
  .put(taskController.update)
  .delete(taskController.delete);

module.exports = router;
