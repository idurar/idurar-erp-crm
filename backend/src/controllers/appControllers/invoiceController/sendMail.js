import fs from 'fs';

import mongoose from 'mongoose';

const mail = async (req, res) => {
  return res.status(200).json({
    success: true,
    result: null,
    message: 'Please Upgrade to Premium  Version to have full features',
  });
};

export default mail;
