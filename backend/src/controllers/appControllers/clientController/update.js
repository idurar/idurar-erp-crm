const mongoose = require('mongoose');

const update = async (Model, req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

module.exports = update;
