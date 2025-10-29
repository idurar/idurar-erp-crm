const express = require('express');
const router = express.Router();
const projectController = require('@/controllers/appControllers/projectController');

// Project routes
router.route('/')
  .get(projectController.list)
  .post(projectController.create);

router.route('/:id')
  .get(projectController.read)
  .put(projectController.update)
  .delete(projectController.delete);

module.exports = router;
