const express = require('express');

const router = express.Router();
const path = require('path');

// Without middleware

router.route('/:subPath/:directory/:file').get(function (req, res) {
  const { subPath, directory, file } = req.params;

  const options = {
    root: path.join(__dirname, `../../public/${subPath}/${directory}`),
  };

  const fileName = file;

  res.sendFile(fileName, options, function (err) {
    if (err) {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
