const Upload = require('@/models/appModels/Upload');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { transliterate, slugify } = require('transliteration');

// middleware to upload the public document
const createPublicUpload = async (req, res, next) => {
  const modelName = req.params.model;
  const fieldId = req.params.fieldId;
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
        isPublic: true,
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
        return res.status(500).json({ success: false, message: 'Oops there is an Error' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Oops there is an Error' });
    }
  } else {
    return res.status(500).json({ success: false, message: 'Oops there is an Error' });
  }
};

// middleware to upload the private document
const createPrivateUpload = async (req, res, next) => {
  const modelName = req.params.model;
  const fieldId = req.params.fieldId;
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
        isPublic: false,
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
        return res.status(500).json({ success: false, message: 'Oops there is an Error' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Oops there is an Error' });
    }
  } else {
    return res.status(500).json({ success: false, message: 'Oops there is an Error' });
  }
};

const storage = multer.diskStorage({
  //-->  public/upload/:model/:fieldId.
  destination: function (req, file, cb) {
    const modelName = req.params.model;
    fs.mkdir(`upload/${modelName}`, (err) => {
      return cb(null, `upload/${modelName}`);
    });
  },
  filename: function (req, file, cb) {
    // fetching the file extention of the uploaded file
    let fileExtension = path.extname(file.originalname);
    let uniqueFileID = Math.random().toString(36).slice(2, 7); //generates unique ID of length 5

    let originalname = slugify(file.originalname.split('.')[0].toLocaleLowerCase()); //convert any language to english characters
    let _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;

    // saving file name and extention in request upload object
    let files = req?.upload?.files ?? [];
    const _data = {
      fileName: _fileName,
      fieldExt: fileExtension,
    };
    files.push(_data);
    req.upload = {
      files: files,
    };
    return cb(null, _fileName);
  },
});

const fileFilter = (req, file, cb) => {
  // array containing all the possible file types
  const _fileType = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/pdf',
    'application/zip',
    'application/vnd.rar',
    'video/mp4',
    'video/x-msvideo',
    'audio/mpeg',
    'video/webm',
  ];

  let _flag = _fileType.includes(file.mimetype);

  if (_flag) {
    return cb(null, true);
  } else {
    return cb(new Error(`${file.mimetype} File type not supported!`));
  }
};

const uploadMiddleware = multer({ storage: storage, fileFilter: fileFilter });

module.exports = { createPublicUpload, createPrivateUpload, uploadMiddleware };
