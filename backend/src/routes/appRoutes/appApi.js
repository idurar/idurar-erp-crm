const express = require('express');

const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const { hasPermission } = require('@/middlewares/permission');

const employeeController = require('@/controllers/appControllers/employeeController');
const salaryController = require('@/controllers/appControllers/salaryController');
const salaryPaymentController = require('@/controllers/appControllers/salaryPaymentController');

const paymentController = require('@/controllers/appControllers/paymentController');
const paymentModeController = require('@/controllers/appControllers/paymentModeController');
const taxController = require('@/controllers/appControllers/taxController');

const clientController = require('@/controllers/appControllers/clientController');
const leadController = require('@/controllers/appControllers/leadController');
const companyController = require('@/controllers/appControllers/companyController');
const peopleController = require('@/controllers/appControllers/peopleController');

const invoiceController = require('@/controllers/appControllers/invoiceController');
const quoteController = require('@/controllers/appControllers/quoteController');
const offerController = require('@/controllers/appControllers/offerController');

const supplierController = require('@/controllers/appControllers/supplierController');
const purchaseController = require('@/controllers/appControllers/purchaseController');

const productController = require('@/controllers/appControllers/productController');

const expenseController = require('@/controllers/appControllers/expenseController');
const expenseCategoryController = require('@/controllers/appControllers/expenseCategoryController');

const orderController = require('@/controllers/appControllers/orderController');
const shipmentController = require('@/controllers/appControllers/shipmentController');
const inventoryController = require('@/controllers/appControllers/inventoryController');

const models = [
  { modelName: 'salary', controller: salaryController },
  { modelName: 'salarypayment', controller: salaryPaymentController },
  { modelName: 'company', controller: companyController },
  { modelName: 'people', controller: peopleController },
  { modelName: 'purchase', controller: purchaseController },
  { modelName: 'shipment', controller: shipmentController },
  { modelName: 'product', controller: productController },
  { modelName: 'quote', controller: quoteController },
  { modelName: 'supplier', controller: supplierController },
  { modelName: 'employee', controller: employeeController },
  { modelName: 'paymentMode', controller: paymentModeController },
  { modelName: 'tax', controller: taxController },
  { modelName: 'client', controller: clientController },
  { modelName: 'lead', controller: leadController },
  { modelName: 'invoice', controller: invoiceController },
  { modelName: 'expense', controller: expenseController },
  { modelName: 'expenseCategory', controller: expenseCategoryController },
  { modelName: 'payment', controller: paymentController },
  { modelName: 'order', controller: orderController },
  { modelName: 'offer', controller: offerController },
  { modelName: 'inventory', controller: inventoryController },
];

models.forEach(({ modelName, controller }) => {
  console.log('🚀 ~ file: appApi.js:78 ~ models.forEach ~ modelName:', modelName);
  router
    .route(`/${modelName}/create`)
    .post(hasPermission('create'), catchErrors(controller.create));
  router.route(`/${modelName}/read/:id`).get(hasPermission('read'), catchErrors(controller.read));
  router
    .route(`/${modelName}/update/:id`)
    .patch(hasPermission('update'), catchErrors(controller.update));
  router
    .route(`/${modelName}/delete/:id`)
    .delete(hasPermission('delete'), catchErrors(controller.delete));
  router.route(`/${modelName}/search`).get(hasPermission('read'), catchErrors(controller.search));
  router.route(`/${modelName}/list`).get(hasPermission('read'), catchErrors(controller.list));
  router.route(`/${modelName}/filter`).get(hasPermission('read'), catchErrors(controller.filter));
  router.route(`/${modelName}/summary`).get(hasPermission('read'), catchErrors(controller.summary));
});

module.exports = router;
