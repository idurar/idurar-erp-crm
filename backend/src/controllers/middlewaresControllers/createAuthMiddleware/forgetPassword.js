import Joi from 'joi';

import mongoose from 'mongoose';

import checkAndCorrectURL from './checkAndCorrectURL.js';
import sendMail from './sendMail.js';
import shortid from 'shortid';
import { loadSettings } from '#middlewares/settings/index.js';

const forgetPassword = async (req, res, { userModel }) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

export default forgetPassword;
