import mongoose from 'mongoose';

const Model = mongoose.model('Offer');

import custom from '#controllers/pdfController/index.js';

import { calculate } from '#helpers.js';

const update = async (req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};
export default update;
