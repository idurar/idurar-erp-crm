const mongoose = require('mongoose');

const update = async (Model, req, res) => {
  // Find document by id and updates with the required fields
  return res.status(200).json({
    success: false,
    result: null,
    message: 'You cant update client once is created',
  });
};

module.exports = update;
