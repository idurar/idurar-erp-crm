const mongoose = require('mongoose');
const Model = mongoose.model('Setting');

const search = async (req, res) => {
  const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['settingKey', 'settingCategory'];

  const fields = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  let results = await Model.find({
    ...fields,
    removed: false,
    isPrivate: false,
  })
    .limit(20)
    .exec();

  if (results.length >= 1) {
    return res.status(200).json({
      success: true,
      result: results,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(202).json({
      success: false,
      result: [],
      message: 'No document found by this request',
    });
  }
};

module.exports = search;
