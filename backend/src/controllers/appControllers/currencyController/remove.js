const mongoose = require('mongoose');

const remove = async (Model, req, res) => {
  // cannot delete client it it have one invoice or Client:
  // check if client have invoice or quotes:
  return res.status(400).json({
    success: false,
    result: null,
    message: 'Cannot remove currency after was created',
  });
};
module.exports = remove;
