const downloadPdf = require('@/handlers/downloadHandler/downloadPdf');
const express = require('express');

const router = express.Router();

router.route('/:subPath/:directory/:id').get(function (req, res) {
  const { subPath, directory, id } = req.params;

  // Handle the /payment/invoice/* route
  if (subPath == 'payment' && directory == 'invoice') {
    downloadPdf(req, res, { directory: 'PaymentInvoice', id });
  } else {
    downloadPdf(req, res, { directory, id });
  }
});

router.route('/:directory/:id').get(function (req, res) {
  const { directory, id } = req.params;

  downloadPdf(req, res, { directory, id });
});

module.exports = router;
