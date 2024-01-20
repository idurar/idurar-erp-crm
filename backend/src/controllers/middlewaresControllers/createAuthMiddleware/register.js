import bcrypt from 'bcryptjs';
import Joi from 'joi';
import mongoose from 'mongoose';
import { generate as uniqueId } from 'shortid';
import { loadSettings } from '#middlewares/settings/index.js';

import checkAndCorrectURL from './checkAndCorrectURL.js';
import sendMail from './sendMail.js';

const register = async (req, res, { userModel }) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

export default register;
