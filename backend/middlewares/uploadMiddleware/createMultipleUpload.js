const Upload = require('@/models/coreModels/Upload');

// middleware to upload the public document
const createMultipleUpload = async (req, res, next) => {
  const modelName = req.params.model;
  const fieldId = req.params.fieldId;
  const isPublic = req.query.ispublic == true ? true : false;
  const userID = req.admin._id;

  if (req?.upload?.files?.length !== 0) {
    let filesArr = req.upload.files;
    let _uploadsArray = [];

    filesArr.forEach((uploadItem) => {
      // creating the object for individual upload document
      let uploadObject = {
        modelName: modelName,
        fieldId: fieldId,
        fileName: uploadItem.fileName,
        fileType: uploadItem.fieldExt.slice(1), //removing the dot from the fileExt
        enabled: true,
        isPublic: isPublic,
        userID: userID,
        isSecure: true,
        removed: false,
        path: `/upload/${modelName}/${uploadItem.fileName}${uploadItem.fieldExt}`,
      };

      _uploadsArray.push(uploadObject);
    });

    try {
      const upload = await Upload.insertMany(_uploadsArray);
      if (upload?.length !== 0) {
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

module.exports = createMultipleUpload;
