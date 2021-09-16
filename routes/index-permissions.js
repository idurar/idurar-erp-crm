const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

const appController = require("../controllers/appController");

const patientController = require("../controllers/patientController");
const employeeController = require("../controllers/employeeController");
const departmentController = require("../controllers/departmentController");
const specialtyController = require("../controllers/specialtyController");
const positionController = require("../controllers/positionController");
const appointmentController = require("../controllers/appointmentController");
const doctorController = require("../controllers/doctorController");
const medicamentController = require("../controllers/medicamentController");
const consultationController = require("../controllers/consultationController");
const currencyTypeController = require("../controllers/currencyTypeController");
const prescriptionController = require("../controllers/prescriptionController");
const paymentController = require("../controllers/paymentController");
const paymentModeController = require("../controllers/paymentModeController");
const analysisController = require("../controllers/analysisController");
const analysisTypeController = require("../controllers/analysisTypeController");
const mriScanController = require("../controllers/mriScanController");
const mriScanTypeController = require("../controllers/mriScanTypeController");
const clientController = require("../controllers/clientController");
const InvoiceController = require("../controllers/InvoiceController");
const itemController = require("../controllers/itemController");
const quoteController = require("../controllers/quoteController");
const supplierController = require("../controllers/supplierController");
const orderFormController = require("../controllers/orderFormController");
const expenseController = require("../controllers/expenseController");
const expenseCategoryController = require("../controllers/expenseCategoryController");
const paymentClientController = require("../controllers/paymentClientController");

const uploadController = require("../controllers/uploadController");

//multer object creation
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

const roleController = require("../controllers/roleController");
const permissionController = require("../controllers/permissionController");

// Middlewares_______________________________________________________________________
const permissionMiddleware = require("../middlewares/permissionMiddleware");

const { catchErrors } = require("../handlers/errorHandlers");

// checking if admin is logged it or not !!
// it's basically a middleware that check if  logged in if yes he can continue the action else he will be redirect to login page
const checkAdmin = require("../middlewares/checkAdmin");
router.get("/*", checkAdmin);

// Render Pages_______________________________________________________________________
router.get("/", appController.dashboard);
router.get("/patient", appController.patient);
router.get("/employee", appController.employee);
router.get("/department", appController.department);
router.get("/position", appController.position);
router.get("/appointment", appController.appointment);
router.get("/doctor", appController.doctor);
router.get("/medicament", appController.medicament);
router.get("/analysis", appController.analysis);
router.get("/specialty", appController.specialty);
router.get("/analysisType", appController.analysisType);
router.get("/client", appController.client);
router.get("/paymentClient", appController.paymentClient);
router.get("/consultationType", appController.consultationType);
router.get("/currencyType", appController.currencyType);
router.get("/expense", appController.expense);
router.get("/expenseCategory", appController.expenseCategory);
router.get("/invoice", appController.invoice);
router.get("/item", appController.item);
router.get("/mriScan", appController.mriScan);
router.get("/mriScanType", appController.mriScanType);
router.get("/orderForm", appController.orderForm);
router.get("/payment", appController.payment);
router.get("/paymentMode", appController.paymentMode);
router.get("/prescription", appController.prescription);
router.get("/quote", appController.quote);
router.get("/supplier", appController.supplier);
router.get(
  "/consultation/:doctorParam?",
  catchErrors(appController.consultation)
);
//______________________________________________________________________________________

// Download pdf file
router.get("/public/download/:pdfname?", appController.download);

//_________________________________________________________________API for Doctors________________________________________________________________________________________________
router.get(
  "/api/doctor/read/:id",
  permissionMiddleware("doctors-read"),
  doctorController.read
);
router.post(
  "/api/doctor/create",
  permissionMiddleware("doctors-create"),
  catchErrors(doctorController.create)
);
router.post(
  "/api/doctor/update/:id",
  permissionMiddleware("doctors-update"),
  catchErrors(doctorController.update)
);
router.get(
  "/api/doctor/delete/:id",
  permissionMiddleware("doctors-delete"),
  catchErrors(doctorController.delete)
);
router.get(
  "/api/doctor/get/:page?/:items?",
  permissionMiddleware("doctors-reads"),
  catchErrors(doctorController.getAll)
);
router.get(
  "/api/doctor/search",
  permissionMiddleware("doctors-read"),
  catchErrors(doctorController.search)
);
router.get(
  "/api/doctor/pdf/:id",
  permissionMiddleware("doctors-read"),
  doctorController.generatePDF
);
router.get(
  "/api/doctor/find/:filter/:equal",
  permissionMiddleware("doctors-read"),
  catchErrors(doctorController.getByFilter)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for patients_____________________
router.post(
  "/api/patient/create",
  permissionMiddleware("patients-create"),
  catchErrors(patientController.create)
);
router.get(
  "/api/patient/read/:id",
  permissionMiddleware("patients-read"),
  catchErrors(patientController.read)
);
router.post(
  "/api/patient/update/:id",
  permissionMiddleware("patients-update"),
  catchErrors(patientController.update)
);
router.get(
  "/api/patient/delete/:id",
  permissionMiddleware("patients-delete"),
  catchErrors(patientController.delete)
);
router.get(
  "/api/patient/get/:page?/:items?",
  permissionMiddleware("patients-read"),
  catchErrors(patientController.getAll)
);
router.get(
  "/api/patient/search",
  permissionMiddleware("patients-read"),
  catchErrors(patientController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for employees_____________________
router.post(
  "/api/employee/create",
  permissionMiddleware("employees-create"),
  catchErrors(employeeController.create)
);
router.get(
  "/api/employee/read/:id",
  permissionMiddleware("employees-read"),
  catchErrors(employeeController.read)
);
router.post(
  "/api/employee/update/:id",
  permissionMiddleware("employees-update"),
  catchErrors(employeeController.update)
);
router.get(
  "/api/employee/delete/:id",
  permissionMiddleware("employees-delete"),
  catchErrors(employeeController.delete)
);
router.get(
  "/api/employee/get/:page?/:items?",
  permissionMiddleware("employees-read"),
  catchErrors(employeeController.getAll)
);
router.get(
  "/api/employee/search",
  permissionMiddleware("employees-read"),
  catchErrors(employeeController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for departements_____________________
router.post(
  "/api/department/create",
  permissionMiddleware("departements-create"),
  catchErrors(departmentController.create)
);
router.get(
  "/api/department/read/:id",
  permissionMiddleware("departements-read"),
  catchErrors(departmentController.read)
);
router.post(
  "/api/department/update/:id",
  permissionMiddleware("departements-update"),
  catchErrors(departmentController.update)
);
router.get(
  "/api/department/delete/:id",
  permissionMiddleware("departements-delete"),
  catchErrors(departmentController.delete)
);
router.get(
  "/api/department/get/:page?/:items?",
  permissionMiddleware("departements-read"),
  catchErrors(departmentController.getAll)
);
router.get(
  "/api/department/search",
  permissionMiddleware("departements-read"),
  catchErrors(departmentController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for speciality_____________________
router.post(
  "/api/specialty/create",
  permissionMiddleware("speciality-create"),
  catchErrors(specialtyController.create)
);
router.get(
  "/api/specialty/read/:id",
  permissionMiddleware("speciality-read"),
  catchErrors(specialtyController.read)
);
router.post(
  "/api/specialty/update/:id",
  permissionMiddleware("speciality-update"),
  catchErrors(specialtyController.update)
);
router.get(
  "/api/specialty/delete/:id",
  permissionMiddleware("speciality-delete"),
  catchErrors(specialtyController.delete)
);
router.get(
  "/api/specialty/get/:page?/:items?",
  permissionMiddleware("speciality-read"),
  catchErrors(specialtyController.getAll)
);
router.get(
  "/api/specialty/search",
  permissionMiddleware("speciality-read"),
  catchErrors(specialtyController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for position_____________________
router.post(
  "/api/position/create",
  permissionMiddleware("position-create"),
  catchErrors(positionController.create)
);
router.get(
  "/api/position/read/:id",
  permissionMiddleware("position-read"),
  catchErrors(positionController.read)
);
router.post(
  "/api/position/update/:id",
  permissionMiddleware("position-update"),
  catchErrors(positionController.update)
);
router.get(
  "/api/position/delete/:id",
  permissionMiddleware("position-delete"),
  catchErrors(positionController.delete)
);
router.get(
  "/api/position/get/:page?/:items?",
  permissionMiddleware("position-read"),
  catchErrors(positionController.getAll)
);
router.get(
  "/api/position/search",
  permissionMiddleware("position-read"),
  catchErrors(positionController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for appointement_________________
router.post(
  "/api/appointment/create",
  permissionMiddleware("appointement-create"),
  catchErrors(appointmentController.create)
);
router.get(
  "/api/appointment/read/:id",
  permissionMiddleware("appointement-read"),
  catchErrors(appointmentController.read)
);
router.post(
  "/api/appointment/update/:id",
  permissionMiddleware("appointement-update"),
  catchErrors(appointmentController.update)
);
router.get(
  "/api/appointment/delete/:id",
  permissionMiddleware("appointement-delete"),
  catchErrors(appointmentController.delete)
);
router.get(
  "/api/appointment/get/:page?/:items?",
  permissionMiddleware("appointement-read"),
  catchErrors(appointmentController.getAll)
);
router.get(
  "/api/appointment/search",
  permissionMiddleware("appointement-read"),
  catchErrors(appointmentController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for medicament____________________
router.post(
  "/api/medicament/create",
  permissionMiddleware("medicament-create"),
  catchErrors(medicamentController.create)
);
router.get(
  "/api/medicament/read/:id",
  permissionMiddleware("medicament-read"),
  catchErrors(medicamentController.read)
);
router.post(
  "/api/medicament/update/:id",
  permissionMiddleware("medicament-update"),
  catchErrors(medicamentController.update)
);
router.get(
  "/api/medicament/delete/:id",
  permissionMiddleware("medicament-delete"),
  catchErrors(medicamentController.delete)
);
router.get(
  "/api/medicament/get/:page?/:items?",
  permissionMiddleware("medicament-read"),
  catchErrors(medicamentController.getAll)
);
router.get(
  "/api/medicament/search",
  permissionMiddleware("medicament-read"),
  catchErrors(medicamentController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for consultation__________________
router.post(
  "/api/consultation/create",
  permissionMiddleware("consultation-create"),
  catchErrors(consultationController.create)
);
router.get(
  "/api/consultation/read/:id",
  permissionMiddleware("consultation-read"),
  catchErrors(consultationController.read)
);
router.post(
  "/api/consultation/update/:id",
  permissionMiddleware("consultation-update"),
  catchErrors(consultationController.update)
);
router.get(
  "/api/consultation/delete/:id",
  permissionMiddleware("consultation-delete"),
  catchErrors(consultationController.delete)
);
router.get(
  "/api/consultation/get/:page?/:items?",
  permissionMiddleware("consultation-read"),
  catchErrors(consultationController.getAll)
);
router.get(
  "/api/consultation/search",
  permissionMiddleware("consultation-read"),
  catchErrors(consultationController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for consultation__________________
router.post(
  "/api/currencyType/create",
  permissionMiddleware("currencyType-create"),
  catchErrors(currencyTypeController.create)
);
router.get(
  "/api/currencyType/read/:id",
  permissionMiddleware("currencyType-read"),
  catchErrors(currencyTypeController.read)
);
router.post(
  "/api/currencyType/update/:id",
  permissionMiddleware("currencyType-update"),
  catchErrors(currencyTypeController.update)
);
router.get(
  "/api/currencyType/delete/:id",
  permissionMiddleware("currencyType-delete"),
  catchErrors(currencyTypeController.delete)
);
router.get(
  "/api/currencyType/get/:page?/:items?",
  permissionMiddleware("currencyType-read"),
  catchErrors(currencyTypeController.getAll)
);
router.get(
  "/api/currencyType/search",
  permissionMiddleware("currencyType-read"),
  catchErrors(currencyTypeController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for preinscription_______________
router.post(
  "/api/prescription/create",
  permissionMiddleware("preinscription-create"),
  catchErrors(prescriptionController.create)
);
router.get(
  "/api/prescription/read/:id",
  permissionMiddleware("preinscription-read"),
  catchErrors(prescriptionController.read)
);
router.post(
  "/api/prescription/update/:id",
  permissionMiddleware("preinscription-update"),
  catchErrors(prescriptionController.update)
);
router.get(
  "/api/prescription/delete/:id",
  permissionMiddleware("preinscription-delete"),
  catchErrors(prescriptionController.delete)
);
router.get(
  "/api/prescription/get/:page?/:items?",
  permissionMiddleware("preinscription-read"),
  catchErrors(prescriptionController.getAll)
);
router.get(
  "/api/prescription/search",
  permissionMiddleware("preinscription-read"),
  catchErrors(prescriptionController.search)
);
router.get(
  "/api/prescription/generatePDF/:id",
  permissionMiddleware("preinscription-read"),
  catchErrors(prescriptionController.generatePDF)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for payment mode_____________________
router.post(
  "/api/paymentMode/create",
  permissionMiddleware("paymentMode-create"),
  catchErrors(paymentModeController.create)
);
router.get(
  "/api/paymentMode/read/:id",
  permissionMiddleware("paymentMode-read"),
  catchErrors(paymentModeController.read)
);
router.post(
  "/api/paymentMode/update/:id",
  permissionMiddleware("paymentMode-update"),
  catchErrors(paymentModeController.update)
);
router.get(
  "/api/paymentMode/delete/:id",
  permissionMiddleware("paymentMode-delete"),
  catchErrors(paymentModeController.delete)
);
router.get(
  "/api/paymentMode/get/:page?/:items?",
  permissionMiddleware("paymentMode-read"),
  catchErrors(paymentModeController.getAll)
);
router.get(
  "/api/paymentMode/search",
  permissionMiddleware("paymentMode-read"),
  catchErrors(paymentModeController.search)
);

//_________________________________________________________________API for payement_____________________
router.post(
  "/api/payment/create",
  permissionMiddleware("payement-create"),
  catchErrors(paymentController.create)
);
router.get(
  "/api/payment/read/:id",
  permissionMiddleware("payement-read"),
  catchErrors(paymentController.read)
);
router.post(
  "/api/payment/update/:id",
  permissionMiddleware("payement-update"),
  catchErrors(paymentController.update)
);
router.get(
  "/api/payment/delete/:id",
  permissionMiddleware("payement-delete"),
  catchErrors(paymentController.delete)
);
router.get(
  "/api/payment/get/:page?/:items?",
  permissionMiddleware("payement-read"),
  catchErrors(paymentController.getAll)
);
router.get(
  "/api/payment/search",
  permissionMiddleware("payement-read"),
  catchErrors(paymentController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for analysis_____________________
router.post(
  "/api/analysis/create",
  permissionMiddleware("analysis-create"),
  catchErrors(analysisController.create)
);
router.get(
  "/api/analysis/read/:id",
  permissionMiddleware("analysis-read"),
  catchErrors(analysisController.read)
);
router.post(
  "/api/analysis/update/:id",
  permissionMiddleware("analysis-update"),
  catchErrors(analysisController.update)
);
router.get(
  "/api/analysis/delete/:id",
  permissionMiddleware("analysis-delete"),
  catchErrors(analysisController.delete)
);
router.get(
  "/api/analysis/get/:page?/:items?",
  permissionMiddleware("analysis-read"),
  catchErrors(analysisController.getAll)
);
router.get(
  "/api/analysis/search",
  permissionMiddleware("analysis-read"),
  catchErrors(analysisController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for analysis type_________________
router.post(
  "/api/analysisType/create",
  permissionMiddleware("analysisType-create"),
  catchErrors(analysisTypeController.create)
);
router.get(
  "/api/analysisType/read/:id",
  permissionMiddleware("analysisType-read"),
  catchErrors(analysisTypeController.read)
);
router.post(
  "/api/analysisType/update/:id",
  permissionMiddleware("analysisType-update"),
  catchErrors(analysisTypeController.update)
);
router.get(
  "/api/analysisType/delete/:id",
  permissionMiddleware("analysisType-delete"),
  catchErrors(analysisTypeController.delete)
);
router.get(
  "/api/analysisType/get/:page?/:items?",
  permissionMiddleware("analysisType-read"),
  catchErrors(analysisTypeController.getAll)
);
router.get(
  "/api/analysisType/search",
  permissionMiddleware("analysisType-read"),
  catchErrors(analysisTypeController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for IRM SCANS_____________________
router.post(
  "/api/mriScan/create",
  permissionMiddleware("mriScan-create"),
  catchErrors(mriScanController.create)
);
router.get(
  "/api/mriScan/read/:id",
  permissionMiddleware("mriScan-read"),
  catchErrors(mriScanController.read)
);
router.post(
  "/api/mriScan/update/:id",
  permissionMiddleware("mriScan-update"),
  catchErrors(mriScanController.update)
);
router.get(
  "/api/mriScan/delete/:id",
  permissionMiddleware("mriScan-delete"),
  catchErrors(mriScanController.delete)
);
router.get(
  "/api/mriScan/get/:page?/:items?",
  permissionMiddleware("mriScan-read"),
  catchErrors(mriScanController.getAll)
);
router.get(
  "/api/mriScan/search",
  permissionMiddleware("mriScan-read"),
  catchErrors(mriScanController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for IRM Scan types________________
router.post(
  "/api/mriScanType/create",
  permissionMiddleware("mriScanType-create"),
  catchErrors(mriScanTypeController.create)
);
router.get(
  "/api/mriScanType/read/:id",
  permissionMiddleware("mriScanType-read"),
  catchErrors(mriScanTypeController.read)
);
router.post(
  "/api/mriScanType/update/:id",
  permissionMiddleware("mriScanType-update"),
  catchErrors(mriScanTypeController.update)
);
router.get(
  "/api/mriScanType/delete/:id",
  permissionMiddleware("mriScanType-delete"),
  catchErrors(mriScanTypeController.delete)
);
router.get(
  "/api/mriScanType/get/:page?/:items?",
  permissionMiddleware("mriScanType-read"),
  catchErrors(mriScanTypeController.getAll)
);
router.get(
  "/api/mriScanType/search",
  permissionMiddleware("mriScanType-read"),
  catchErrors(mriScanTypeController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for clients_______________________
router.post(
  "/api/client/create",
  permissionMiddleware("clients-create"),
  catchErrors(clientController.create)
);
router.get(
  "/api/client/read/:id",
  permissionMiddleware("clients-read"),
  catchErrors(clientController.read)
);
router.post(
  "/api/client/update/:id",
  permissionMiddleware("clients-update"),
  catchErrors(clientController.update)
);
router.get(
  "/api/client/delete/:id",
  permissionMiddleware("clients-delete"),
  catchErrors(clientController.delete)
);
router.get(
  "/api/client/get/:page?/:items?",
  permissionMiddleware("clients-read"),
  catchErrors(clientController.getAll)
);
router.get(
  "/api/client/search",
  permissionMiddleware("clients-read"),
  catchErrors(clientController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for invoices_____________________
router.post(
  "/api/Invoice/create",
  permissionMiddleware("invoices-create"),
  catchErrors(InvoiceController.create)
);
router.get(
  "/api/Invoice/read/:id",
  permissionMiddleware("invoices-read"),
  catchErrors(InvoiceController.read)
);
router.post(
  "/api/Invoice/update/:id",
  permissionMiddleware("invoices-update"),
  catchErrors(InvoiceController.update)
);
router.get(
  "/api/Invoice/delete/:id",
  permissionMiddleware("invoices-delete"),
  catchErrors(InvoiceController.delete)
);
router.get(
  "/api/Invoice/get/:page?/:items?",
  permissionMiddleware("invoices-read"),
  catchErrors(InvoiceController.getAll)
);
router.get(
  "/api/Invoice/search",
  permissionMiddleware("invoices-read"),
  catchErrors(InvoiceController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for items_____________________
router.post(
  "/api/item/create",
  permissionMiddleware("items-create"),
  catchErrors(itemController.create)
);
router.get(
  "/api/item/read/:id",
  permissionMiddleware("items-read"),
  catchErrors(itemController.read)
);
router.post(
  "/api/item/update/:id",
  permissionMiddleware("items-update"),
  catchErrors(itemController.update)
);
router.get(
  "/api/item/delete/:id",
  permissionMiddleware("items-delete"),
  catchErrors(itemController.delete)
);
router.get(
  "/api/item/get/:page?/:items?",
  permissionMiddleware("items-read"),
  catchErrors(itemController.getAll)
);
router.get(
  "/api/item/search",
  permissionMiddleware("items-read"),
  catchErrors(itemController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for Quotes_____________________
router.post(
  "/api/quote/create",
  permissionMiddleware("quotes-create"),
  catchErrors(quoteController.create)
);
router.get(
  "/api/quote/read/:id",
  permissionMiddleware("quotes-read"),
  catchErrors(quoteController.read)
);
router.post(
  "/api/quote/update/:id",
  permissionMiddleware("quotes-update"),
  catchErrors(quoteController.update)
);
router.get(
  "/api/quote/delete/:id",
  permissionMiddleware("quotes-delete"),
  catchErrors(quoteController.delete)
);
router.get(
  "/api/quote/get/:page?/:items?",
  permissionMiddleware("quotes-read"),
  catchErrors(quoteController.getAll)
);
router.get(
  "/api/quote/search",
  permissionMiddleware("quotes-read"),
  catchErrors(quoteController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for suppliers_____________________
router.post(
  "/api/supplier/create",
  permissionMiddleware("suppliers-create"),
  catchErrors(supplierController.create)
);
router.get(
  "/api/supplier/read/:id",
  permissionMiddleware("suppliers-read"),
  catchErrors(supplierController.read)
);
router.post(
  "/api/supplier/update/:id",
  permissionMiddleware("suppliers-update"),
  catchErrors(supplierController.update)
);
router.get(
  "/api/supplier/delete/:id",
  permissionMiddleware("suppliers-delete"),
  catchErrors(supplierController.delete)
);
router.get(
  "/api/supplier/get/:page?/:items?",
  permissionMiddleware("suppliers-read"),
  catchErrors(supplierController.getAll)
);
router.get(
  "/api/supplier/search",
  permissionMiddleware("suppliers-read"),
  catchErrors(supplierController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for order Forms_____________________
router.post(
  "/api/orderForm/create",
  permissionMiddleware("forms-create"),
  catchErrors(orderFormController.create)
);
router.get(
  "/api/orderForm/read/:id",
  permissionMiddleware("forms-read"),
  catchErrors(orderFormController.read)
);
router.post(
  "/api/orderForm/update/:id",
  permissionMiddleware("forms-update"),
  catchErrors(orderFormController.update)
);
router.get(
  "/api/orderForm/delete/:id",
  permissionMiddleware("forms-delete"),
  catchErrors(orderFormController.delete)
);
router.get(
  "/api/orderForm/get/:page?/:items?",
  permissionMiddleware("forms-read"),
  catchErrors(orderFormController.getAll)
);
router.get(
  "/api/orderForm/search",
  permissionMiddleware("forms-read"),
  catchErrors(orderFormController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for expenses_____________________
router.post(
  "/api/expense/create",
  permissionMiddleware("expenses-create"),
  catchErrors(expenseController.create)
);
router.get(
  "/api/expense/read/:id",
  permissionMiddleware("formexpensess-read"),
  catchErrors(expenseController.read)
);
router.post(
  "/api/expense/update/:id",
  permissionMiddleware("expenses-update"),
  catchErrors(expenseController.update)
);
router.get(
  "/api/expense/delete/:id",
  permissionMiddleware("expenses-delete"),
  catchErrors(expenseController.delete)
);
router.get(
  "/api/expense/get/:page?/:items?",
  permissionMiddleware("expenses-read"),
  catchErrors(expenseController.getAll)
);
router.get(
  "/api/expense/search",
  permissionMiddleware("expenses-read"),
  catchErrors(expenseController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for expense categories________________
router.post(
  "/api/expenseCategory/create",
  permissionMiddleware("categories-create"),
  catchErrors(expenseCategoryController.create)
);
router.get(
  "/api/expenseCategory/read/:id",
  permissionMiddleware("categories-read"),
  catchErrors(expenseCategoryController.read)
);
router.post(
  "/api/expenseCategory/update/:id",
  permissionMiddleware("categories-update"),
  catchErrors(expenseCategoryController.update)
);
router.get(
  "/api/expenseCategory/delete/:id",
  permissionMiddleware("categories-delete"),
  catchErrors(expenseCategoryController.delete)
);
router.get(
  "/api/expenseCategory/get/:page?/:items?",
  permissionMiddleware("categories-read"),
  catchErrors(expenseCategoryController.getAll)
);
router.get(
  "/api/expenseCategory/search",
  permissionMiddleware("categories-read"),
  catchErrors(expenseCategoryController.search)
);
//______________________________________________________________________________________________________

//_________________________________________________________________API for client payments_________________
router.post(
  "/api/paymentClient/create",
  permissionMiddleware("paymentClients-create"),
  catchErrors(paymentClientController.create)
);
router.get(
  "/api/paymentClient/read/:id",
  permissionMiddleware("paymentClients-read"),
  catchErrors(paymentClientController.read)
);
router.post(
  "/api/paymentClient/update/:id",
  permissionMiddleware("paymentClients-update"),
  catchErrors(paymentClientController.update)
);
router.get(
  "/api/paymentClient/delete/:id",
  permissionMiddleware("paymentClients-delete"),
  catchErrors(paymentClientController.delete)
);
router.get(
  "/api/paymentClient/get/:page?/:items?",
  permissionMiddleware("paymentClients-read"),
  catchErrors(paymentClientController.getAll)
);
router.get(
  "/api/paymentClient/search",
  permissionMiddleware("paymentClients-read"),
  catchErrors(paymentClientController.search)
);
//_____________________________________________________________________________________________________________________________________________________________________________

/* Do work here
router.get('/', (req, res) => {
  res.send('Hey! It works!');
});
*/
//_________________________________________________________________ account management_______________________________
router.get("/login", adminController.loginForm);
router.post("/login", authController.login, function (req, res) {
  if (req.body.remember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
  } else {
    req.session.cookie.expires = false; // Cookie expires at end of session
  }
  res.redirect("/");
});
router.get("/register", adminController.registerForm);

// 1. Validate the registration data
// 2. register the admin
// 3. we need to log them in
router.post(
  "/register",
  adminController.validateRegister,
  adminController.register,
  authController.login
);

router.get("/logout", authController.logout);

router.get("/account", authController.isLoggedIn, adminController.account);
router.post("/account", catchErrors(adminController.updateAccount));
router.post("/account/forgot", catchErrors(authController.forgot));
router.get("/account/reset/:token", catchErrors(authController.reset));
router.post(
  "/account/reset/:token",
  authController.confirmedPasswords,
  catchErrors(authController.update)
);
//____________________________________________________________________________________________________________________

//_________________________________________________________________ uploads_______________________________
router.get("/upload", uploadController.uploadsView);
router.post("/upload", upload.single("imageupload"), function (req, res) {
  res.send("File upload sucessfully.");
});

//_________________________________________________________________ role management_______________________________
router.get(
  "/roles",
  permissionMiddleware("administrator-create"),
  roleController.getAdminWithRoles
);
router.post(
  "/roles",
  permissionMiddleware("administrator-create"),
  roleController.setUpAdminWithRole
);

//_________________________________________________________________ permissions management_______________________________
// this route is used to get get the list of the admins that we can give permissions to
router.get(
  "/permissions/admins",
  permissionMiddleware("employees-read"),
  permissionController.getAdmins
);
// this route is used to get a list of the permissions of the chosed used ( admin _id passed as a param in the link)
router.get(
  "/permissions/admins/:_id",
  permissionMiddleware("employees-read"),
  permissionController.getAdminPermissions
);
// this route is used to update the permissions of the selected admin ( the admin is pre selected throw the previous)
router.post(
  "/permissions/admins/update",
  permissionMiddleware("employees-update"),
  permissionController.updateAdminPermissions
);
//router.post('/roles',permissionMiddleware('administrator-create'), roleController.setUpAdminWithRole);

// Hello salah, this is just a test !
//  we can delete this later
const mail = require("../handlers/mail");
router.get("/emailTest", (req, res, next) => {
  console.log("we in ");
  mail.send({
    filename: "email-layout",
    email: "abdoumjr@gmail.com",
    subject: "This is just a test :)",
  });
  res.send("Mail sent!");
});
// Test ends here :)

// this is a test for queued email
// this test will send an email in 1 minute :) just for test reasons
const mailJob = require("../jobs/mailJob");
router.get("/mailJobTest", (req, res, next) => {
  let when = new Date();
  // this is just for testing
  when.setMinutes(when.getMinutes() + 1);
  when.setHours(when.getHours() + 1);

  // we can pass the date and time when we want our email to be sent here as "when"
  mailJob(when);
  res.send("Sending emails");
});

module.exports = router;
