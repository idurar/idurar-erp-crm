const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const Project = mongoose.model('Project');

// Create a new task
exports.create = async (req, res) => {
  try {
    const { name, description, startDate, endDate, project } = req.body;
    const task = new Task({
      name,
      description,
      startDate,
      endDate,
      project,
    });
    const result = await task.save();

    // Add task to project
    await Project.findByIdAndUpdate(project, { $push: { tasks: result._id } });

    res.status(201).json({
      success: true,
      result,
      message: 'Task created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all tasks for a project
exports.list = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });
    res.status(200).json({
      success: true,
      result: tasks,
      message: 'Tasks retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get a single task
exports.read = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    res.status(200).json({
      success: true,
      result: task,
      message: 'Task retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update a task
exports.update = async (req, res) => {
  try {
    const { name, description, startDate, endDate, dependencies } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { name, description, startDate, endDate, dependencies },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    res.status(200).json({
      success: true,
      result: task,
      message: 'Task updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete a task
exports.delete = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    // Remove task from project
    await Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
