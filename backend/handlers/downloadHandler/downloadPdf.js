const custom = require('@/controllers/middlewaresControllers/pdfController');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = downloadPdf = async (req, res, { directory, id }) => {
  try {
    const modelName = directory.slice(0, 1).toUpperCase() + directory.slice(1);
    if (!mongoose.models[modelName]) {
      throw new Error(`Model '${modelName}' does not exist`);
    }
    const Model = mongoose.model(modelName);
    const result = await Model.findById(ObjectId(id)).exec();

    // Throw error if no result
    if (!result) {
      throw { name: 'ValidationError' };
    }

    // Continue process if result is returned
    await custom.generatePdf(
      modelName,
      { filename: modelName, format: 'A4' },
      result,
      async (fileLocation) => {
        return res.download(fileLocation, (error) => {
          if (error)
            res.status(500).json({
              success: false,
              result: null,
              message: "Couldn't find file",
              error: error.message,
            });
        });
      }
    );
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Required fields are not supplied',
      });
    } else if (error.name == 'BSONTypeError') {
      // If error is thrown by Mongoose due to invalid ID
      return res.status(400).json({
        success: false,
        result: null,
        error: error.message,
        message: 'Invalid ID',
      });
    } else {
      // Server Error
      console.log(error);
      return res.status(500).json({
        success: false,
        result: null,
        error: error.message,
        message: error.message,
      });
    }
  }
};
