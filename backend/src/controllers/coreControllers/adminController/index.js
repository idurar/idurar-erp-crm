const createUserController = require('@/controllers/middlewaresControllers/createUserController');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const mongoose = require('mongoose');

// Create base controllers
const userController = createUserController('Admin');
const crudMethods = createCRUDController('Admin');

// Custom delete function to prevent owner deletion
const customDelete = async (req, res) => {
  const Admin = mongoose.model('Admin');
  
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid ID format',
    });
  }

  const objectId = new mongoose.Types.ObjectId(req.params.id);
  
  // Check if admin exists and get their role
  const admin = await Admin.findOne({ _id: objectId, removed: false }).exec();
  
  if (!admin) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found',
    });
  }

  // Prevent deletion of owner accounts
  if (admin.role === 'owner') {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Owner accounts cannot be deleted',
    });
  }

  // Proceed with soft delete
  const result = await Admin.findOneAndUpdate(
    { _id: objectId },
    { $set: { removed: true } },
    { new: true }
  ).exec();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully deleted the document',
  });
};

// Merge all methods and override delete
module.exports = {
  ...userController,
  ...crudMethods,
  delete: customDelete,
};
