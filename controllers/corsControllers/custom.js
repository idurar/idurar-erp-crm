const mongoose = require('mongoose');

let pdf = require('html-pdf');
const pug = require('pug');
const fs = require('fs');
const moment = require('moment');

exports.getData = (model) => {
  const Model = mongoose.model(model);
  const result = Model.find({ removed: false });
  return result;
};

exports.getOne = (model, id) => {
  const Model = mongoose.model(model);
  const result = Model.findOne({ _id: id, removed: false });
  return result;
};

exports.regExSearch = async (Model, req, res) => {
  let results = await Model.find({
    name: { $regex: new RegExp(req.query.q, 'i') },
  })
    .sort({ name: 'asc' })
    .limit(10);

  if (results.length >= 1) {
    res.status(200).json(results).end();
  } else {
    results = [];
    res.status(202).json(results).end();
  }
};

exports.search = async (Model, req, res) => {
  let results = await Model.find({ birthday: req.query.q }).sort({ name: 'asc' }).limit(10);

  if (results.length < 1 || !results) {
    results = await Model
      // first find stores that match
      .find(
        {
          $text: {
            $search: req.query.q,
          },
        },
        {
          score: { $meta: 'textScore' },
        }
      )
      // the sort them
      .sort({
        score: { $meta: 'textScore' },
      })
      // limit to only 5 messages
      .limit(10);
    console.log(results);
  }

  if (results.length >= 1) {
    res.status(200).json(results).end();
  } else {
    results = [];
    res.status(202).json(results).end();
  }
};

/*
 * Pdf Generate New Method
 * This method only generate PDF in the folder, not download the PDF
 */
exports.generatePdf = (modelName, info = { filename: 'pdf_file', format: 'A5' }, result) => {
  const fileId = info.filename + '-' + result._id + '.pdf';

  // if PDF already exist, then delete it and create new PDF
  const folderPath = modelName.toLowerCase();
  if (fs.existsSync(`./public/download/${folderPath}/${fileId}`)) {
    fs.unlinkSync(`./public/download/${folderPath}/${fileId}`);
  }

  //render pdf html
  const html = pug.renderFile('views/pdf/' + modelName + '.pug', {
    model: result,
    moment: moment,
  });

  pdf
    .create(html, {
      format: info.format,
      orientation: 'portrait',
      border: '12mm',
    })
    .toFile(`./public/download/${folderPath}/${fileId}`, function (err) {
      if (err) return console.log('this pdf create error ' + err);
    });
};
