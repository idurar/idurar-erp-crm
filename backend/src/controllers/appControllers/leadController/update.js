const mongoose = require('mongoose');
const People = mongoose.model('People');
const Company = mongoose.model('Company');

const update = async (Model, req, res) => {
  // Find document by id and updates with the required fields

  if (req.body.type === 'people') {
    if (!req.body.people) {
      return res.status(403).json({
        success: false,
        message: 'Please select a people',
      });
    } else {
      let { firstname, lastname } = await People.findOne({
        _id: req.body.people,
        removed: false,
      }).exec();
      req.body.name = firstname + ' ' + lastname;
      req.body.company = null;
    }
  } else {
    if (!req.body.company) {
      return res.status(403).json({
        success: false,
        message: 'Please select a company',
      });
    } else {
      let { name } = await Company.findOne({
        _id: req.body.company,
        removed: false,
      }).exec();
      req.body.name = name;

      req.body.people = null;
    }
  }

  console.log('🚀 ~ file: update.js:34 ~ update ~ req.body:', req.body);
  req.body.removed = false;
  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
    new: true, // return the new result instead of the old one
    runValidators: true,
  }).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found by this id: ' + req.params.id,
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document by this id: ' + req.params.id,
    });
  }
};

module.exports = update;
