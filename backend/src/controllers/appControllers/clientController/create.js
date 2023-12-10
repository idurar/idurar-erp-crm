const mongoose = require('mongoose');

const People = mongoose.model('People');
const Company = mongoose.model('Company');

const create = async (Model, req, res) => {
  // Creating a new document in the collection

  if (req.body.type === 'people') {
    if (!req.body.people) {
      return res.status(403).json({
        success: false,
        message: 'Please select a people',
      });
    } else {
      let { firstname, lastname } = await People.findOneAndUpdate(
        {
          _id: req.body.people,
          removed: false,
        },
        { isClient: true },
        {
          new: true, // return the new result instead of the old one
          runValidators: true,
        }
      ).exec();
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
      let { name } = await Company.findOneAndUpdate(
        {
          _id: req.body.company,
          removed: false,
        },
        { isClient: true },
        {
          new: true, // return the new result instead of the old one
          runValidators: true,
        }
      ).exec();
      req.body.name = name;
      req.body.people = null;
    }
  }

  req.body.removed = false;
  const result = await new Model(req.body).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

module.exports = create;
