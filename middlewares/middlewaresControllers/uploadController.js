const Upload = require('../../models/coreModels/Upload');
const path = require('path');

exports.uploadFileData = async (req, res, next) => {
  const { model, fieldId } = req.params;
  const { isSecure } = req.body; 
  const newUpload = new Upload({
    modelName: model,
    fieldId,
    enabled: true,
    isPublic: req.isPublic,
    userID: req.admin._id,
    isSecure,
    removed: false,
    path: req.file.path,
  });
  try {
    const result = await newUpload.save();
    const uniqueFileName = result._id + path.extname(file.originalname);
    req.newFileName = uniqueFileName;
    result.path = uniqueFileName;
    req.modelName = model
    await result.save();
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};
