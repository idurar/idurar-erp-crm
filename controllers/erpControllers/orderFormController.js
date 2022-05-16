const mongoose = require('mongoose');
const Model = mongoose.model('OrderForm');
const custom = require('../corsControllers/custom');

const crudController = require('../corsControllers/crudController');
const methods = crudController.createCRUDController('OrderForm');

delete methods['create'];
delete methods['update'];

methods.create = async (req, res) => {
  try {
    var { items = [], taxRate = 0, discount = 0 } = req.body;

    // default
    var subTotal = 0;
    var taxTotal = 0;
    var total = 0;
    var credit = 0;

    //Calculate the items array with subTotal, total, taxTotal
    items = items.map((item) => {
      let total = item['quantity'] * item['price'];
      //sub total
      subTotal += total;
      //item total
      item['total'] = total;
      return item;
    });

    taxTotal = subTotal * taxRate;
    total = subTotal + taxTotal;

    let body = req.body;

    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;

    // Creating a new document in the collection
    const save = await new Model(body).save();

    let modelId = save.id;

    //Calculate credited amount
    const findById = await Model.findById(modelId).populate('expense');
    if (findById['expense'].length > 0) {
      findById['expense'].map((item) => {
        credit += item.total;
      });
    }

    let update = {};
    update['credit'] = credit;

    //Calculate payment status
    if (total - discount - credit <= 0) {
      update['paymentStatus'] = 'paid';
    }

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: modelId }, update, {
      new: true,
    }).exec();

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: 'Successfully created the Quote in Model',
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
      });
    }
  }
};

methods.update = async (req, res) => {
  try {
    const { id } = req.params;
    var { items = [], taxRate = 0, discount = 0 } = req.body;

    // default
    var subTotal = 0;
    var taxTotal = 0;
    var total = 0;
    var credit = 0;

    //Calculate the items array with subTotal, total, taxTotal
    items = items.map((item) => {
      let total = item['quantity'] * item['price'];
      //sub total
      subTotal += total;
      //item total
      item['total'] = total;
      return item;
    });

    taxTotal = subTotal * taxRate;
    total = subTotal + taxTotal;

    let body = req.body;

    body['subTotal'] = subTotal;
    body['taxTotal'] = taxTotal;
    body['total'] = total;

    //Calculate credited amount
    const findById = await Model.findById(id).populate('expense');
    if (findById['expense'].length > 0) {
      findById['expense'].map((item) => {
        credit += item.amount;
      });
    }

    body['credit'] = credit;

    //Calculate payment status
    if (total - discount - credit <= 0) {
      body['paymentStatus'] = 'paid';
    }

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: id }, body, {
      new: true,
    }).exec();

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: 'Successfully updated the Quote in Model',
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
      });
    }
  }
};

module.exports = methods;
