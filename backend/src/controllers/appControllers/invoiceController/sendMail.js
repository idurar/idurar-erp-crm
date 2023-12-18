import fs from 'fs';
import custom from '#controllers/pdfController/index.js';
import { SendInvoice } from '#emailTemplate/SendInvoice.js';
import mongoose from 'mongoose';
const InvoiceModel = mongoose.model('Invoice');
import { Resend } from 'resend';
import { loadSettings } from '#middlewares/settings/index.js';

const mail = async (req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

export default mail;
