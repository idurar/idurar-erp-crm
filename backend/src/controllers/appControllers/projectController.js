const mongoose = require('mongoose');
const Project = mongoose.model('Project');

// Create a new project
exports.create = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const project = new Project({
      name,
      description,
      startDate,
      endDate,
    });
    const result = await project.save();
    res.status(201).json({
      success: true,
      result,
      message: 'Project created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all projects
exports.list = async (req, res) => {
  try {
    const projects = await Project.find().populate('tasks');
    res.status(200).json({
      success: true,
      result: projects,
      message: 'Projects retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get a single project
exports.read = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('tasks');
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.status(200).json({
      success: true,
      result: project,
      message: 'Project retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update a project
exports.update = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, startDate, endDate },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.status(200).json({
      success: true,
      result: project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete a project
exports.delete = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
