const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { slugify } = require('transliteration');

const fileFilter = require('./fileFilter');

const singleStorageUpload = ({
  entity,
  filename = 'default',
  fileType = 'default',
  fieldName = 'file',
}) => {
  var diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/uploads/${entity}`);
    },
    filename: function (req, file, cb) {
      // fetching the file extention of the uploaded file
      let fileExtension = path.extname(file.originalname);
      let uniqueFileID = Math.random().toString(36).slice(2, 7); //generates unique ID of length 5

      let originalname = '';
      if (req.body.seotitle) {
        originalname = slugify(req.body.seotitle.toLocaleLowerCase()); //convert any language to english characters
      } else {
        originalname = slugify(file.originalname.split('.')[0].toLocaleLowerCase()); //convert any language to english characters
      }

      let _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;

      const filePath = `public/uploads/${entity}/${_fileName}`;
      // saving file name and extention in request upload object
      req.upload = {
        fileName: _fileName,
        fieldExt: fileExtension,
        entity: entity,
        fieldName: fieldName,
        fileType: fileType,
        filePath: filePath,
      };

      req.body[fieldName] = filePath;

      return cb(null, _fileName);
    },
  });

  let filterType = fileFilter(fileType);

  const multerStorage = multer({ storage: diskStorage, fileFilter: filterType }).single('file');

  return multerStorage;
};

module.exports = singleStorageUpload;
