const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { slugify } = require('transliteration');

const fileFilter = require('./fileFilter');

// middleware to upload the public document
const storage = multer.diskStorage({
  //-->  public/upload/:model/:fieldId.
  destination: function (req, file, cb) {
    const modelName = req.params.model;
    fs.mkdir(`upload/${modelName}`, (error) => {
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

const uploadMultipleToStorage = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploadMultipleToStorage;
