const mongoose = require('mongoose');

const Client = mongoose.model('Client');
const People = mongoose.model('People');

const remove = async (Model, req, res) => {
  // cannot delete client it it have one invoice or Client:
  // check if client have invoice or quotes:
  const { id } = req.params;
  console.log('🚀 ~ companyController: remove.js:10 ~ remove ~ id:', id);

  // first find if there alt least one quote or invoice exist corresponding to the client
  const client = await Client.findOne({ company: id, removed: false }).exec();
  if (client) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete company if company attached to any people or she is client',
    });
  }
  const people = await People.findOne({ company: id, removed: false }).exec();
  if (people) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Cannot delete company if company attached to any people or she is client',
    });
  }

  // if no People or quote, delete the client
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
