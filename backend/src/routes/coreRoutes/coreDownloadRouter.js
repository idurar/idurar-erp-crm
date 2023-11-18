const downloadPdf = require('@/handlers/downloadHandler/downloadPdf');
const express = require('express');

const router = express.Router();
const { hasPermission } = require('@/middlewares/permission');

router.route('/:directory/:file').get(function (req, res) {
  try {
    const { directory, file } = req.params;
    const id = file.slice(directory.length + 1).slice(0, -4); // extract id from file name
    downloadPdf(req, res, { directory, id });
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
