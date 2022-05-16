var express = require('express');
var router = express.Router();

exports.uploadsView = async (req, res, next) => {
  // res.render("upload", { title: "Upload" });
  res.status(200).json({ api: ' uploadForm' });
};

exports.upload = async (req, res, next) => {
  console.warn(req);
  upload.single('imageupload');
  res.send('File upload sucessfully.');
};
