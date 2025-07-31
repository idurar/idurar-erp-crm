const remove = async (Model, req, res) => {
  try {
    const { id } = req.params;
    
    // Validate the provided ID
    if (!id) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Document ID is required',
      });
    }

    // Check if document exists and is not already removed
    const existingDoc = await Model.findOne({
      _id: id,
      removed: false,
    }).exec();

    if (!existingDoc) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Document not found or already deleted',
      });
    }

    // Use findOneAndUpdate with atomic operation to prevent race conditions
    const result = await Model.findOneAndUpdate(
      {
        _id: id,
        removed: false, // Only update if not already removed (prevents double deletion)
      },
      { 
        $set: { 
          removed: true,
          removedAt: new Date(), // Add timestamp for when it was removed
          removedBy: req.admin?._id || req.user?._id, // Track who removed it
        }
      },
      {
        new: true, // return the updated document
        runValidators: true, // run schema validators
      }
    ).exec();

    // Double-check if the update was successful
    if (!result) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'Document was already deleted by another process',
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Document successfully deleted',
    });

  } catch (error) {
    console.error('Delete operation failed:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid document ID format',
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Validation error during deletion',
        error: error.message,
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error during deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = remove;