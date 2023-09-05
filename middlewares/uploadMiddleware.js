const Upload = require('@/models/erpModels/Upload');
const multer = require('multer');

// middleware to upload the public document
const createPublicUpload = async (req, res, next) => {
  const modelName = req.params.model;
  const fieldId = req.params.fieldId;
  const userID = req.admin._id;
  console.log('Body is:', req);

  try {
    // create the file document
    const upload = await Upload.create({
      modelName: modelName,
      fieldId: fieldId,
      enabled: true,
      isPublic: true,
      userID: userID,
      isSecure: true,
      removed: false,
      path: `/upload/${modelName}`,
    });
    if (upload) {
      req.upload = upload;
      next();
    } else {
      return res.status(500).json({ success: false, message: 'Oops there is an Error' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Oops there is an Error' });
  }
};

// cmiddleware to upload the private document
const createPrivateUpload = async (req, res, next) => {
  const modelName = req.params.model;
  const fieldId = req.params.fieldId;
  const userID = req.admin._id;
  console.Upload('Body is:', req);
  try {
    const upload = await Upload.create({
      modelName: modelName,
      fieldId: fieldId,
      enabled: true,
      isPublic: false,
      userID: userID,
      isSecure: true,
      removed: false,
      path: `/upload/${modelName}`,
    });

    if (upload) {
      req.upload = upload;
      next();
    } else {
      return res.status(500).json({ success: false, message: 'Oops there is an Error' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Oops there is an Error' });
  }
};

const upload = multer.diskStorage({
  //-->  public/upload/:model/:fieldId.
  destination: function (req, file, cb) {
    if (req.upload) {
      return cb(null, `upload/${req.upload.modelName}`);
    }
  },
  filename: function (req, file, cb) {
    if (req.upload) {
      // fetching the file extention of the uploaded file
      let fileExtension = file.originalname.split('.')[1];
      let _fileName = `${req.upload._id}.${fileExtension}`;
      cb(null, _fileName);
    }
  },
});

const uploadMiddleware = multer({ storage: upload });

module.exports = { createPublicUpload, createPrivateUpload, uploadMiddleware };
