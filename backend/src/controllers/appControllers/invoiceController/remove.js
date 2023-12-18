import mongoose from 'mongoose';

const Model = mongoose.model('Invoice');
const ModalPayment = mongoose.model('Payment');

const remove = async (req, res) => {
  return res.status(200).json({
    success: false,
    result: null,
    upgrade: true,
    message: 'please upgrade to use all app features',
  });
};

export default remove;
