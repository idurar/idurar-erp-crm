const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const shortid = require('shortid');

const verify = async (req, res, { userModel }) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

module.exports = verify;
