const express = require('express');

const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const employeeController = require('@/controllers/appControllers/employeeController');
const paymentModeController = require('@/controllers/appControllers/paymentModeController');
const clientController = require('@/controllers/appControllers/clientController');
const leadController = require('@/controllers/appControllers/leadController');
const invoiceController = require('@/controllers/appControllers/invoiceController');
const itemController = require('@/controllers/appControllers/itemController');
const quoteController = require('@/controllers/appControllers/quoteController');
const supplierController = require('@/controllers/appControllers/supplierController');
const supplierOrderController = require('@/controllers/appControllers/supplierOrderController');
const expenseController = require('@/controllers/appControllers/expenseController');
const expenseCategoryController = require('@/controllers/appControllers/expenseCategoryController');
const paymentInvoiceController = require('@/controllers/appControllers/paymentInvoiceController');

const offerController = require('@/controllers/appControllers/offerController');

// //_________________________________ API for employees_____________________
router.route('/employee/create').post(catchErrors(employeeController.create));
router.route('/employee/read/:id').get(catchErrors(employeeController.read));
router.route('/employee/update/:id').patch(catchErrors(employeeController.update));
router.route('/employee/delete/:id').delete(catchErrors(employeeController.delete));
router.route('/employee/search').get(catchErrors(employeeController.search));
router.route('/employee/list').get(catchErrors(employeeController.list));
router.route('/employee/filter').get(catchErrors(employeeController.filter));

// //_____________________________________ API for payment mode_____________________
router.route('/paymentMode/create').post(catchErrors(paymentModeController.create));
router.route('/paymentMode/read/:id').get(catchErrors(paymentModeController.read));
router.route('/paymentMode/update/:id').patch(catchErrors(paymentModeController.update));
router.route('/paymentMode/delete/:id').delete(catchErrors(paymentModeController.delete));
router.route('/paymentMode/search').get(catchErrors(paymentModeController.search));
router.route('/paymentMode/list').get(catchErrors(paymentModeController.list));
router.route('/paymentMode/filter').get(catchErrors(paymentModeController.filter));

// //_____________________________________ API for clients __________________________________________________
router.route('/client/create').post(catchErrors(clientController.create));
router.route('/client/read/:id').get(catchErrors(clientController.read));
router.route('/client/update/:id').patch(catchErrors(clientController.update));
router.route('/client/delete/:id').delete(catchErrors(clientController.delete));
router.route('/client/search').get(catchErrors(clientController.search));
router.route('/client/list').get(catchErrors(clientController.list));
router.route('/client/filter').get(catchErrors(clientController.filter));
router.route('/client/summary').get(catchErrors(clientController.summary));

// //_____________________________________ API for leads __________________________________________________
router.route('/lead/create').post(catchErrors(leadController.create));
router.route('/lead/read/:id').get(catchErrors(leadController.read));
router.route('/lead/update/:id').patch(catchErrors(leadController.update));
router.route('/lead/delete/:id').delete(catchErrors(leadController.delete));
router.route('/lead/search').get(catchErrors(leadController.search));
router.route('/lead/list').get(catchErrors(leadController.list));
router.route('/lead/filter').get(catchErrors(leadController.filter));
router.route('/lead/summary').get(catchErrors(leadController.summary));

// //_________________________________________________________________API for invoices_____________________
router.route('/invoice/create').post(catchErrors(invoiceController.create));
router.route('/invoice/read/:id').get(catchErrors(invoiceController.read));
router.route('/invoice/update/:id').patch(catchErrors(invoiceController.update));
router.route('/invoice/delete/:id').delete(catchErrors(invoiceController.delete));
router.route('/invoice/search').get(catchErrors(invoiceController.search));
router.route('/invoice/list').get(catchErrors(invoiceController.list));
router.route('/invoice/filter').get(catchErrors(invoiceController.filter));
router.route('/invoice/pdf/:id').get(catchErrors(invoiceController.generatePDF));
router.route('/invoice/summary').get(catchErrors(invoiceController.summary));
router.route('/invoice/mail').post(catchErrors(invoiceController.sendMail));

// //_________________________________________________________________API for items_____________________
router.route('/item/create').post(catchErrors(itemController.create));
router.route('/item/read/:id').get(catchErrors(itemController.read));
router.route('/item/update/:id').patch(catchErrors(itemController.update));
router.route('/item/delete/:id').delete(catchErrors(itemController.delete));
router.route('/item/search').get(catchErrors(itemController.search));
router.route('/item/list').get(catchErrors(itemController.list));
router.route('/item/filter').get(catchErrors(itemController.filter));

// //_________________________________________________________________API for Quotes_____________________

router.route('/quote/create').post(catchErrors(quoteController.create));
router.route('/quote/read/:id').get(catchErrors(quoteController.read));
router.route('/quote/update/:id').patch(catchErrors(quoteController.update));
router.route('/quote/delete/:id').delete(catchErrors(quoteController.delete));
router.route('/quote/search').get(catchErrors(quoteController.search));
router.route('/quote/list').get(catchErrors(quoteController.list));
router.route('/quote/filter').get(catchErrors(quoteController.filter));
router.route('/quote/pdf/:id').get(catchErrors(quoteController.generatePDF));
router.route('/quote/summary').get(catchErrors(quoteController.summary));
router.route('/quote/convert/:id').get(catchErrors(quoteController.convertQuoteToInvoice));
router.route('/quote/mail').post(catchErrors(quoteController.sendMail));

// //___________________________________________ API for suppliers _____________________
router.route('/supplier/create').post(catchErrors(supplierController.create));
router.route('/supplier/read/:id').get(catchErrors(supplierController.read));
router.route('/supplier/update/:id').patch(catchErrors(supplierController.update));
router.route('/supplier/delete/:id').delete(catchErrors(supplierController.delete));
router.route('/supplier/search').get(catchErrors(supplierController.search));
router.route('/supplier/list').get(catchErrors(supplierController.list));
router.route('/supplier/filter').get(catchErrors(supplierController.filter));

// //___________________________________________ API for suppliers _____________________
router.route('/supplierOrder/create').post(catchErrors(supplierOrderController.create));
router.route('/supplierOrder/read/:id').get(catchErrors(supplierOrderController.read));
router.route('/supplierOrder/update/:id').patch(catchErrors(supplierOrderController.update));
router.route('/supplierOrder/delete/:id').delete(catchErrors(supplierOrderController.delete));
router.route('/supplierOrder/search').get(catchErrors(supplierOrderController.search));
router.route('/supplierOrder/list').get(catchErrors(supplierOrderController.list));
router.route('/supplierOrder/filter').get(catchErrors(supplierOrderController.filter));

// //_________________________________________________________________API for expenses_____________________

router.route('/expense/create').post(catchErrors(expenseController.create));
router.route('/expense/read/:id').get(catchErrors(expenseController.read));
router.route('/expense/update/:id').patch(catchErrors(expenseController.update));
router.route('/expense/delete/:id').delete(catchErrors(expenseController.delete));
router.route('/expense/search').get(catchErrors(expenseController.search));
router.route('/expense/list').get(catchErrors(expenseController.list));
router.route('/expense/filter').get(catchErrors(expenseController.filter));

// //_________________________________________________________________API for expense categories________________

router.route('/expenseCategory/create').post(catchErrors(expenseCategoryController.create));
router.route('/expenseCategory/read/:id').get(catchErrors(expenseCategoryController.read));
router.route('/expenseCategory/update/:id').patch(catchErrors(expenseCategoryController.update));
router.route('/expenseCategory/delete/:id').delete(catchErrors(expenseCategoryController.delete));
router.route('/expenseCategory/search').get(catchErrors(expenseCategoryController.search));
router.route('/expenseCategory/list').get(catchErrors(expenseCategoryController.list));
router.route('/expenseCategory/filter').get(catchErrors(expenseCategoryController.filter));

// //_____________________________________________ API for client payments_________________

router.route('/payment/invoice/create').post(catchErrors(paymentInvoiceController.create));
router.route('/payment/invoice/read/:id').get(catchErrors(paymentInvoiceController.read));
router.route('/payment/invoice/update/:id').patch(catchErrors(paymentInvoiceController.update));
router.route('/payment/invoice/delete/:id').delete(catchErrors(paymentInvoiceController.delete));
router.route('/payment/invoice/search').get(catchErrors(paymentInvoiceController.search));
router.route('/payment/invoice/list').get(catchErrors(paymentInvoiceController.list));
router.route('/payment/invoice/filter').get(catchErrors(paymentInvoiceController.filter));
router.route('/payment/invoice/pdf/:id').get(catchErrors(paymentInvoiceController.generatePDF));
router.route('/payment/invoice/summary').get(catchErrors(paymentInvoiceController.summary));

//router.route('/payment/invoice/mail').post(catchErrors(paymentInvoiceController.sendMail));

// //_________________________________________________________________API for Offers_____________________

router.route('/offer/create').post(catchErrors(offerController.create));
router.route('/offer/read/:id').get(catchErrors(offerController.read));
router.route('/offer/update/:id').patch(catchErrors(offerController.update));
router.route('/offer/delete/:id').delete(catchErrors(offerController.delete));
router.route('/offer/search').get(catchErrors(offerController.search));
router.route('/offer/list').get(catchErrors(offerController.list));
router.route('/offer/filter').get(catchErrors(offerController.filter));
router.route('/offer/pdf/:id').get(catchErrors(offerController.generatePDF));
router.route('/offer/summary').get(catchErrors(offerController.summary));

module.exports = router;
