import mongoose from 'mongoose';
import { generate as uniqueId } from 'shortid';

const updatePassword = async (userModel, req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

export default updatePassword;
