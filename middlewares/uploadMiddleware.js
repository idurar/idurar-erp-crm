const Upload = require('@/models/erpModels/Upload');
const multer = require('multer');
const path = require('path');
const { transliterate, slugify } = require('transliteration');

// middleware to upload the public document
const createPublicUpload = async (req, res, next) => {
  const modelName = req.params.model;
  const fieldId = req.params.fieldId;
  const userID = req.admin._id;
  console.log('Body is:', req);

  if (req.upload) {
    let { fileName, fieldExt } = req.upload;

    try {
      // create the file document
      const upload = await Upload.create({
        modelName: modelName,
        fieldId: fieldId,
        fileName: fileName,
        fileType: fieldExt,
        enabled: true,
        isPublic: true,
        userID: userID,
        isSecure: true,
        removed: false,
        path: `/upload/${modelName}/${fileName}${fieldExt}`, //the dot is not required as fieldExt already contains a dot
      });
      if (upload) {
        next();
      } else {
        return res.status(500).json({ success: false, message: 'Oops there is an Error' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Oops there is an Error' });
    }
  } else {
    return res.status(500).json({ success: false, message: 'Oops there is an Error' });
  }
};

// cmiddleware to upload the private document
const createPrivateUpload = async (req, res, next) => {
  const modelName = req.params.model;
  const fieldId = req.params.fieldId;
  const userID = req.admin._id;

  if (req.upload) {
    let { fileName, fieldExt } = req.upload;
    try {
      const upload = await Upload.create({
        modelName: modelName,
        fieldId: fieldId,
        fileName: fileName,
        fileType: fieldExt,
        enabled: true,
        isPublic: false,
        userID: userID,
        isSecure: true,
        removed: false,
        path: `/upload/${modelName}/${fileName}${fieldExt}`, //the dot is not required as fieldExt already contains a dot
      });

      if (upload) {
        next();
      } else {
        return res.status(500).json({ success: false, message: 'Oops there is an Error' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Oops there is an Error' });
    }
  } else {
    return res.status(500).json({ success: false, message: 'Oops there is an Error' });
  }
};

const upload = multer.diskStorage({
  //-->  public/upload/:model/:fieldId.
  destination: function (req, file, cb) {
    const modelName = req.params.model;
    console.log('folder is: ', __dirname);
    return cb(null, path.join(__dirname, `./upload/${modelName}`));
  },
  filename: function (req, file, cb) {
    // fetching the file extention of the uploaded file
    let fileExtension = path.extname(file.originalname);
    let uniqueFileID = Math.random().toString(16).slice(2, 7); //generates unique ID of length 5

    let originalname = slugify(file.originalname.split('.')[0].toLocaleLowerCase()); //convert any language to english characters
    let _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;

    // saving file name and extention in request upload object
    req.upload = {
      fileName: _fileName,
      fieldExt: fileExtension,
    };
    console.log(req.upload);
    return cb(null, _fileName);
  },
});

const uploadMiddleware = multer({ storage: upload });

module.exports = { createPublicUpload, createPrivateUpload, uploadMiddleware };
