const Upload = require('@/models/coreModels/Upload');

// cmiddleware to upload the private document
const createSingleUpload = async (req, res, next) => {
  const modelName = req.params.model;
  const fieldId = req.params.fieldId;
  const isPublic = req.query.ispublic == true ? true : false;
  const userID = req.admin._id;

  if (req.upload) {
    let { fileName, fieldExt } = req.upload;
    try {
      const upload = await Upload.create({
        modelName: modelName,
        fieldId: fieldId,
        fileName: fileName,
        fileType: fieldExt.slice(1), //removing the dot from the fileExt
        enabled: true,
        isPublic: isPublic,
        userID: userID,
        isSecure: true,
        removed: false,
        path: `/upload/${modelName}/${fileName}${fieldExt}`,
      });

      if (upload) {
        next();
      } else {
        return res.status(500).json({ success: false, message: error.message });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = createSingleUpload;
