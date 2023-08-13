// const crudController = require("./corsControllers/crudController");
// module.exports = crudController.createCRUDController("Invoice");

const mongoose = require('mongoose');
const Model = mongoose.model('Customer');
const crudController = require('../corsControllers/crudController');
const methods = crudController.createCRUDController('Customer');

delete methods['read'];


methods.read = async (req, res) => {
  try {

    // Get the current month and year
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

// Calculate the start and end of the current month
const startOfMonth = new Date(currentYear, currentMonth, 1);
const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

 const thisMonth =  await  Model.countDocuments({
  created: { $gte: startOfMonth, $lte: endOfMonth }
});



   const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

 // last 30days customer login 
const thirtyDaysCustomerLogin = await Model.countDocuments({
    Lastlogin: { $gte: thirtyDaysAgo}
});

    // total Customer
   const totalCustomer  = await Model.countDocuments({});

   // cal percentage with total
const perThirtyDaysCustomerLogin = (thirtyDaysCustomerLogin / totalCustomer) * 100;
const perThisMonth = (thisMonth / totalCustomer)* 100;


  return res.status(200).json({
      success: true,
      result:{perThisMonth,perThirtyDaysCustomerLogin},
      message: 'success',
    });
 
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        error: err,
        message: 'Required fields are not supplied',
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        error: err,
        message: 'Oops there is an Error',
      });
    }
  }
};


module.exports = methods;
