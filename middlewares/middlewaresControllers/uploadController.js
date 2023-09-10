const Upload = require('../../models/coreModels/Upload');
const path = require('path');
const multer = require('multer');
const fs = require('fs');


exports.uploadFileData = async (req, res, next) => {
  const { model, fieldId } = req.params;
  const { isSecure } = req.body;
  let filePath = req.filePath;
  filePath = filePath + req.fileName;
  filePath = filePath.replace('\\', '/');

  const newUpload = new Upload({
    modelName: model,
    fieldId,
    enabled: true,
    isPublic: req.isPublic,
    userID: req.admin._id,
    isSecure,
    removed: false,
    path: filePath,
  });

  try {
    const result = await newUpload.save();
    return res.status(200).json({
      success: true,
      result: result,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
    });
  }
};

let storage = multer.diskStorage({
  destination: (req, file, callback)=> {
    let public = 'public';
    if (!req.isPublic) public = 'private';
    req.filePath = `uploads/${public}/${req.params.model}/`;
    let folderPath = path.join(__dirname, '../../')
    folderPath = path.join(folderPath, req.filePath.toString());
    fs.mkdirSync(folderPath, {recursive:true});
    callback(null, folderPath);
  },
  filename: (request, file, callback) =>{
    // let fileExtension = path.extname(file.originalname);
    let uniqueFileID = Math.random().toString(16).slice(2, 7); //generates unique ID of length 5
    let uniqueFileName = `${uniqueFileID}-${file.originalname}`;
    request.fileName = uniqueFileName;
    callback(null, uniqueFileName);
  },
});
exports.upload = multer({ storage: storage });