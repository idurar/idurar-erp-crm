const custom = require('@/controllers/middlewaresControllers/pdfController');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = downloadPdf = async (req, res, { directory, id }) => {
  const modelName = directory.slice(0, 1).toUpperCase() + directory.slice(1);
  const Model = mongoose.model(modelName);

  try {
    const result = await Model.findById(ObjectId(id)).exec();

    // Throw error if no result
    if (!result) {
      throw { name: 'ValidationError' };
    }

    // Continue process if result is returned
    await custom.generatePdf(
      modelName,
      { filename: modelName, format: 'A4' },
      result.invoice ?? result,
      async (fileLocation) => {
        return res.download(fileLocation, (err) => {
          if (err) res.status(500).json({ success: false, message: "Couldn't find file" });
        });
      }
    );
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: err,
        message: 'Required fields are not supplied',
      });
    } else if (err.name == 'BSONTypeError') {
      // If err is thrown by Mongoose due to invalid ID
      return res.status(400).json({
        success: false,
        result: null,
        error: err,
        message: 'Invalid ID',
      });
    } else {
      // Server Error
      console.log(err);
      return res.status(500).json({
        success: false,
        result: null,
        error: err,
        message: 'Oops there is an Error',
      });
    }
  }
};
