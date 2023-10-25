const downloadPdf = require('@/handlers/downloadHandler/downloadPdf');
const express = require('express');
const path = require('path');
const router = express.Router();
const { hasPermission } = require('@/middlewares/permission');

// router.route('/:directory/:file').get(function (req, res) {
//   const { directory, file } = req.params;

//   // Handle the /payment/* route

//   const options = {
//     root: path.join(__dirname, `../../public/download/${directory}`),
//     dotfiles: 'deny',
//     headers: {
//       'Content-type': 'application/pdf',
//       'Content-disposition': 'inline; filename="' + file + '"',
//     },
//   };

//   res.status(200).sendFile(file, options, function (error) {
//     if (error) {
//       const id = file.slice(directory.length + 1).slice(0, -4); // extract id from file name
//       downloadPdf(req, res, { directory, id });
//     }
//   });
// });

router.route('/:directory/:file').get(function (req, res) {
  const { directory, file } = req.params;
  const id = file.slice(directory.length + 1).slice(0, -4); // extract id from file name
  downloadPdf(req, res, { directory, id });
});

module.exports = router;
