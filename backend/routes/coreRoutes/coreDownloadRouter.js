const downloadPdf = require('@/handlers/downloadHandler/downloadPdf');
const express = require('express');

const router = express.Router();
const { hasPermission } = require('@/middlewares/permission');

router.route('/:subPath/:directory/:id').get(function (req, res) {
  const { subPath, directory, id } = req.params;

  // Handle the /payment/* route
  if (subPath == 'payment' && directory == 'invoice') {
    downloadPdf(req, res, { directory: 'Payment', id });
  } else {
    downloadPdf(req, res, { directory, id });
  }
});

// router.route('/:directory/:id').get(function (req, res) {
//   const { directory, id } = req.params;

//   downloadPdf(req, res, { directory, id });
// });

module.exports = router;
