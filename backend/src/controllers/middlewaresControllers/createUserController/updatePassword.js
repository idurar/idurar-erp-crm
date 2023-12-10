const mongoose = require('mongoose');

const { generate: uniqueId } = require('shortid');

const updatePassword = async (userModel, req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

module.exports = updatePassword;
