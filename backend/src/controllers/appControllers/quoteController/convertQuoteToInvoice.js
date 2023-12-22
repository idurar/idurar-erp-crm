import mongoose from 'mongoose';
import moment from 'moment';

const Model = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');

const convertQuoteToInvoice = async (req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

export default convertQuoteToInvoice;
