const express = require('express');

const router = express.Router();
const path = require('path');

// Without middleware

router.route('/:subPath/:directory/:file').get(function (req, res) {
  try {
    const { subPath, directory, file } = req.params;

    const options = {
      root: path.join(__dirname, `../../public/${subPath}/${directory}`),
    };
    const fileName = file;
    res.sendFile(fileName, options, function (error) {
      if (error) {
        res.status(404).json({
          success: false,
          result: null,
          message: 'we could not find : ' + file,
        });
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
});

module.exports = router;
