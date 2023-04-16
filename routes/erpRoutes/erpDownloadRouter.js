const express = require('express');

const router = express.Router();

router.route('/:directory/:filename').get(function (req, res) {
  const file = `download/${req.params.directory}/${req.params.filename}`;

  res.download(file, function (err) {
    if (err) res.status(500).json({ success: false, message: "couldn't find file" }); // send a 500 on error
  });
});

module.exports = router;
