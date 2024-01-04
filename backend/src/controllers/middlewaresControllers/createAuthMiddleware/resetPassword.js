import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import mongoose from 'mongoose';
import shortid from 'shortid';

const resetPassword = async (req, res, { userModel }) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

export default resetPassword;
