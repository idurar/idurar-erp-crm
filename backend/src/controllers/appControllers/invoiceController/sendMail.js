const fs = require('fs');
const custom = require('@/controllers/pdfController');
const { SendInvoice } = require('@/emailTemplate/SendInvoice');
const mongoose = require('mongoose');
const InvoiceModel = mongoose.model('Invoice');
const { Resend } = require('resend');
const { loadSettings } = require('@/middlewares/settings');

const mail = async (req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

module.exports = mail;
