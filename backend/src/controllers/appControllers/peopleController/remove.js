const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const Company = mongoose.model('Company');

const remove = async (Model, req, res) => {
  // cannot delete client it it have one invoice or Client:
  // check if client have invoice or quotes:
  const { id } = req.params;

  // first find if there alt least one quote or invoice exist corresponding to the client
  const client = await Client.findOne({ people: id, removed: false }).exec();
  if (client) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete people if people attached to any company or he is client',
    });
  }
  const company = await Company.findOne({ mainContact: id, removed: false }).exec();
  if (company) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete people if people attached to any company or he is client',
    });
  }

  // if no Company or quote, delete the client
  const result = await Model.findOneAndUpdate(
    { _id: id, removed: false },
    {
      $set: {
        removed: true,
      },
    }
  ).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No people found by this id: ' + id,
    });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Deleted the people by id: ' + id,
  });
};
module.exports = remove;
