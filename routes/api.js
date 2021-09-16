const express = require("express");
const multer = require("multer");
const path = require("path");
const setFilePathToBody = require("../middlewares/setFilePathToBody");
const { catchErrors } = require("../handlers/errorHandlers");

const router = express.Router();

const adminController = require("../controllers/adminController");
const roleController = require("../controllers/roleController");
const permissionController = require("../controllers/permissionController");

const patientController = require("../controllers/patientController");
const employeeController = require("../controllers/employeeController");
const departmentController = require("../controllers/departmentController");
const specialtyController = require("../controllers/specialtyController");
const positionController = require("../controllers/positionController");
const appointmentController = require("../controllers/appointmentController");
const doctorController = require("../controllers/doctorController");
const medicamentController = require("../controllers/medicamentController");
const consultationController = require("../controllers/consultationController");
// const laboratoryConsultationController = require("../controllers/laboratoryConsultationController");
const currencyController = require("../controllers/currencyController");
const prescriptionController = require("../controllers/prescriptionController");
const paymentController = require("../controllers/paymentController");
const paymentModeController = require("../controllers/paymentModeController");
const analysisController = require("../controllers/analysisController");
const analysisTypeController = require("../controllers/analysisTypeController");
const mriScanController = require("../controllers/mriScanController");
const mriScanTypeController = require("../controllers/mriScanTypeController");
const clientController = require("../controllers/clientController");
const invoiceController = require("../controllers/invoiceController");
const itemController = require("../controllers/itemController");
const quoteController = require("../controllers/quoteController");
const supplierController = require("../controllers/supplierController");
const orderFormController = require("../controllers/orderFormController");
const expenseController = require("../controllers/expenseController");
const expenseCategoryController = require("../controllers/expenseCategoryController");
const paymentClientController = require("../controllers/paymentClientController");
const consultationTypeController = require("../controllers/consultationTypeController");
const consultationRecordingController = require("../controllers/consultationRecordingController");

const settingCommercialController = require("../controllers/settingCommercialController");
const settingMedicalController = require("../controllers/settingMedicalController");
const settingGlobalController = require("../controllers/settingGlobalController");
const taskController = require("../controllers/taskController");
const customMenuController = require("../controllers/customMenuController");

// Middlewares_______________________________________________________________________
// const permissionMiddleware = require("../middlewares/permissionMiddleware");
// const settingMiddleware = require("../middlewares/settingMiddleware");

// //_______________________________ Admin management_______________________________

var adminPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/admin");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const adminPhotoUpload = multer({ storage: adminPhotoStorage });

router
  .route("/admin/create")
  .post(
    [adminPhotoUpload.single("photo"), setFilePathToBody],
    catchErrors(adminController.create)
  );
router.route("/admin/read/:id").get(catchErrors(adminController.read));
router.route("/admin/update/:id").patch(catchErrors(adminController.update));
router.route("/admin/delete/:id").delete(catchErrors(adminController.delete));
router.route("/admin/search").get(catchErrors(adminController.search));
router.route("/admin/list").get(catchErrors(adminController.list));
router.route("/admin/profile").get(catchErrors(adminController.profile));
router.route("/admin/status/:id").patch(catchErrors(adminController.status));
router
  .route("/admin/photo")
  .post(
    [adminPhotoUpload.single("photo"), setFilePathToBody],
    catchErrors(adminController.photo)
  );
router
  .route("/admin/password-update/:id")
  .patch(catchErrors(adminController.updatePassword));
//list of admins ends here

// //____________________________ role management_______________________________

router.route("/role/create").post(catchErrors(roleController.create));
router.route("/role/read/:id").get(catchErrors(roleController.read));
router.route("/role/update/:id").patch(catchErrors(roleController.update));
router.route("/role/delete/:id").delete(catchErrors(roleController.delete));
router.route("/role/search").get(catchErrors(roleController.search));
router.route("/role/list").get(catchErrors(roleController.list));
router.route("/role/filter").get(catchErrors(roleController.filter));

// //_________________________________________________________________ permissions management_______________________________
// // this route is used to get get the list of the admins that we can give permissions to

router
  .route("/permission/create")
  .post(catchErrors(permissionController.create));
router
  .route("/permission/read/:id")
  .get(catchErrors(permissionController.read));
router
  .route("/permission/update/:id")
  .patch(catchErrors(permissionController.update));
router
  .route("/permission/delete/:id")
  .delete(catchErrors(permissionController.delete));
router
  .route("/permission/search")
  .get(catchErrors(permissionController.search));
router.route("/permission/list").get(catchErrors(permissionController.list));
router
  .route("/permission/filter")
  .get(catchErrors(permissionController.filter));

// //_______________________________________API for patients_____________________
router.route("/patient/create").post(catchErrors(patientController.create));
router.route("/patient/read/:id").get(catchErrors(patientController.read));
router
  .route("/patient/update/:id")
  .patch(catchErrors(patientController.update));
router
  .route("/patient/delete/:id")
  .delete(catchErrors(patientController.delete));
router.route("/patient/search").get(catchErrors(patientController.search));
router.route("/patient/list").get(catchErrors(patientController.list));
router.route("/patient/filter").get(catchErrors(patientController.filter));

//___________________________________API for Doctors______________________________
router.route("/doctor/create").post(catchErrors(doctorController.create));
router.route("/doctor/read/:id").get(catchErrors(doctorController.read));
router.route("/doctor/update/:id").patch(catchErrors(doctorController.update));
router.route("/doctor/delete/:id").delete(catchErrors(doctorController.delete));
router.route("/doctor/search").get(catchErrors(doctorController.search));
router.route("/doctor/list").get(catchErrors(doctorController.list));
router.route("/doctor/filter").get(catchErrors(doctorController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for employees_____________________
router.route("/employee/create").post(catchErrors(employeeController.create));
router.route("/employee/read/:id").get(catchErrors(employeeController.read));
router
  .route("/employee/update/:id")
  .patch(catchErrors(employeeController.update));
router
  .route("/employee/delete/:id")
  .delete(catchErrors(employeeController.delete));
router.route("/employee/search").get(catchErrors(employeeController.search));
router.route("/employee/list").get(catchErrors(employeeController.list));
router.route("/employee/filter").get(catchErrors(employeeController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for departements_____________________
router
  .route("/department/create")
  .post(catchErrors(departmentController.create));
router
  .route("/department/read/:id")
  .get(catchErrors(departmentController.read));
router
  .route("/department/update/:id")
  .patch(catchErrors(departmentController.update));
router
  .route("/department/delete/:id")
  .delete(catchErrors(departmentController.delete));
router
  .route("/department/search")
  .get(catchErrors(departmentController.search));
router.route("/department/list").get(catchErrors(departmentController.list));
router
  .route("/department/filter")
  .get(catchErrors(departmentController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for speciality_____________________

router.route("/specialty/create").post(catchErrors(specialtyController.create));
router.route("/specialty/read/:id").get(catchErrors(specialtyController.read));
router
  .route("/specialty/update/:id")
  .patch(catchErrors(specialtyController.update));
router
  .route("/specialty/delete/:id")
  .delete(catchErrors(specialtyController.delete));
router.route("/specialty/search").get(catchErrors(specialtyController.search));
router.route("/specialty/list").get(catchErrors(specialtyController.list));
router.route("/specialty/filter").get(catchErrors(specialtyController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for position_____________________

router.route("/position/create").post(catchErrors(positionController.create));
router.route("/position/read/:id").get(catchErrors(positionController.read));
router
  .route("/position/update/:id")
  .patch(catchErrors(positionController.update));
router
  .route("/position/delete/:id")
  .delete(catchErrors(positionController.delete));
router.route("/position/search").get(catchErrors(positionController.search));
router.route("/position/list").get(catchErrors(positionController.list));
router.route("/position/filter").get(catchErrors(positionController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for appointement_________________

router
  .route("/appointment/create")
  .post(catchErrors(appointmentController.create));
router
  .route("/appointment/read/:id")
  .get(catchErrors(appointmentController.read));
router
  .route("/appointment/update/:id")
  .patch(catchErrors(appointmentController.update));
router
  .route("/appointment/delete/:id")
  .delete(catchErrors(appointmentController.delete));
router
  .route("/appointment/search")
  .get(catchErrors(appointmentController.search));
router.route("/appointment/list").get(catchErrors(appointmentController.list));
router
  .route("/appointment/filter")
  .get(catchErrors(appointmentController.filter));

router
  .route("/appointment/count/:status")
  .get(catchErrors(appointmentController.getAllAppointmentCount));
router
  .route("/appointment/doctor/:doctorid/:status")
  .get(catchErrors(appointmentController.getAppointmentCountByDoctorId));
router
  .route("/appointment/getby/:filter/:equal/:date")
  .get(catchErrors(appointmentController.getFilterbyDate));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for medicament____________________
router
  .route("/medicament/create")
  .post(catchErrors(medicamentController.create));
router
  .route("/medicament/read/:id")
  .get(catchErrors(medicamentController.read));
router
  .route("/medicament/update/:id")
  .patch(catchErrors(medicamentController.update));
router
  .route("/medicament/delete/:id")
  .delete(catchErrors(medicamentController.delete));
router
  .route("/medicament/search")
  .get(catchErrors(medicamentController.search));
router.route("/medicament/list").get(catchErrors(medicamentController.list));
router
  .route("/medicament/filter")
  .get(catchErrors(medicamentController.filter));

// //______________________________________________________________________________________________________

// //_______________________________ API for consultation audio recording __________________________________

var consultationAudioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/consultation");
  },
  filename: function (req, file, cb) {
    var ext = ".mp3";
    cb(null, Date.now() + ext); //Appending extension
  },
});
const consultationAudioUpload = multer({ storage: consultationAudioStorage });

router
  .route("/audiorecording/create")
  .post(
    [consultationAudioUpload.single("audioFile"), setFilePathToBody],
    catchErrors(consultationRecordingController.create)
  );
router
  .route("/audiorecording/read/:id")
  .get(catchErrors(consultationRecordingController.read));
router
  .route("/audiorecording/update/:id")
  .patch(catchErrors(consultationRecordingController.update));
router
  .route("/audiorecording/delete/:id")
  .delete(catchErrors(consultationRecordingController.delete));
router
  .route("/audiorecording/search")
  .get(catchErrors(consultationRecordingController.search));
router
  .route("/audiorecording/list")
  .get(catchErrors(consultationRecordingController.list));
router
  .route("/audiorecording/filter")
  .get(catchErrors(consultationRecordingController.filter));

// //_______________________________ API for consultation __________________________________
router
  .route("/consultation/create")
  .post(catchErrors(consultationController.create));
router
  .route("/consultation/read/:id")
  .get(catchErrors(consultationController.read));
router
  .route("/consultation/update/:id")
  .patch(catchErrors(consultationController.update));
router
  .route("/consultation/delete/:id")
  .delete(catchErrors(consultationController.delete));
router
  .route("/consultation/search")
  .get(catchErrors(consultationController.search));
router
  .route("/consultation/list")
  .get(catchErrors(consultationController.list));
router
  .route("/consultation/filter")
  .get(catchErrors(consultationController.filter));

router
  .route("/consultation/unpaid/count/:doctorid?")
  .get(catchErrors(consultationController.getUnpaidConsultationCount));
router
  .route("/consultation/unpaid/list/:patientid/:status")
  .get(catchErrors(consultationController.getUnpaidConsultationByPatientId));

// //______________________________________________________________________________________________________

// //________________________________ API for Laboratory consultation _____________________________________

// router
//   .route("/laboratoryConsultation")
//   .post(catchErrors(laboratoryConsultation.create))
//   .get(catchErrors(laboratoryConsultation.getAll));
// router
//   .route("/laboratoryConsultation/:id")
//   .patch(catchErrors(laboratoryConsultation.update))
//   .delete(catchErrors(laboratoryConsultation.delete));
// router
//   .route("/laboratoryConsultation/search")
//   .get(catchErrors(laboratoryConsultation.search));
// router
//   .route("/laboratoryConsultation/find/:filter/:equal")
//   .get(catchErrors(laboratoryConsultation.filter));

// router.get(
//   "/api/laboratoryConsultation/unpaid/count/:doctorid?",
//   catchErrors(laboratoryConsultationController.getUnpaidConsultationCount)
// );
// router.get(
//   "/api/laboratory-consultation/unpaid/list/:patientid/:status",
//   catchErrors(laboratoryConsultationController.getUnpaidConsultationByPatientId)
// );

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for currency ____________________

router.route("/currency/create").post(catchErrors(currencyController.create));
router.route("/currency/read/:id").get(catchErrors(currencyController.read));
router
  .route("/currency/update/:id")
  .patch(catchErrors(currencyController.update));
router
  .route("/currency/delete/:id")
  .delete(catchErrors(currencyController.delete));
router.route("/currency/search").get(catchErrors(currencyController.search));
router.route("/currency/list").get(catchErrors(currencyController.list));
router.route("/currency/filter").get(catchErrors(currencyController.filter));

// //______________________________________________________________________________________________________

// //___________________________________________ API for preinscription ___________________________________

router
  .route("/prescription/create")
  .post(catchErrors(prescriptionController.create));
router
  .route("/prescription/read/:id")
  .get(catchErrors(prescriptionController.read));
router
  .route("/prescription/update/:id")
  .patch(catchErrors(prescriptionController.update));
router
  .route("/prescription/delete/:id")
  .delete(catchErrors(prescriptionController.delete));
router
  .route("/prescription/search")
  .get(catchErrors(prescriptionController.search));
router
  .route("/prescription/list")
  .get(catchErrors(prescriptionController.list));
router
  .route("/prescription/filter")
  .get(catchErrors(prescriptionController.filter));

router
  .route("/prescription/pdf/:id")
  .get(catchErrors(prescriptionController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for payment mode_____________________
router
  .route("/paymentMode/create")
  .post(catchErrors(paymentModeController.create));
router
  .route("/paymentMode/read/:id")
  .get(catchErrors(paymentModeController.read));
router
  .route("/paymentMode/update/:id")
  .patch(catchErrors(paymentModeController.update));
router
  .route("/paymentMode/delete/:id")
  .delete(catchErrors(paymentModeController.delete));
router
  .route("/paymentMode/search")
  .get(catchErrors(paymentModeController.search));
router.route("/paymentMode/list").get(catchErrors(paymentModeController.list));
router
  .route("/paymentMode/filter")
  .get(catchErrors(paymentModeController.filter));

// //_________________________________________________________________API for payement_____________________

router.route("/payment/create").post(catchErrors(paymentController.create));
router.route("/payment/read/:id").get(catchErrors(paymentController.read));
router
  .route("/payment/update/:id")
  .patch(catchErrors(paymentController.update));
router
  .route("/payment/delete/:id")
  .delete(catchErrors(paymentController.delete));
router.route("/payment/search").get(catchErrors(paymentController.search));
router.route("/payment/list").get(catchErrors(paymentController.list));
router.route("/payment/filter").get(catchErrors(paymentController.filter));

router
  .route("/payment/pdf/:id")
  .get(catchErrors(paymentController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for analysis_____________________

router.route("/analysis/create").post(catchErrors(analysisController.create));
router.route("/analysis/read/:id").get(catchErrors(analysisController.read));
router
  .route("/analysis/update/:id")
  .patch(catchErrors(analysisController.update));
router
  .route("/analysis/delete/:id")
  .delete(catchErrors(analysisController.delete));
router.route("/analysis/search").get(catchErrors(analysisController.search));
router.route("/analysis/list").get(catchErrors(analysisController.list));
router.route("/analysis/filter").get(catchErrors(analysisController.filter));

router
  .route("/analysis/pdf/:id")
  .get(catchErrors(analysisController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for analysis type_________________

router
  .route("/analysisType/create")
  .post(catchErrors(analysisTypeController.create));
router
  .route("/analysisType/read/:id")
  .get(catchErrors(analysisTypeController.read));
router
  .route("/analysisType/update/:id")
  .patch(catchErrors(analysisTypeController.update));
router
  .route("/analysisType/delete/:id")
  .delete(catchErrors(analysisTypeController.delete));
router
  .route("/analysisType/search")
  .get(catchErrors(analysisTypeController.search));
router
  .route("/analysisType/list")
  .get(catchErrors(analysisTypeController.list));
router
  .route("/analysisType/filter")
  .get(catchErrors(analysisTypeController.filter));

// //______________________________________________________________________________________________________

// //____________________________________________ API for IRM SCANS _______________________________________

router.route("/mriScan/create").post(catchErrors(mriScanController.create));
router.route("/mriScan/read/:id").get(catchErrors(mriScanController.read));
router
  .route("/mriScan/update/:id")
  .patch(catchErrors(mriScanController.update));
router
  .route("/mriScan/delete/:id")
  .delete(catchErrors(mriScanController.delete));
router.route("/mriScan/search").get(catchErrors(mriScanController.search));
router.route("/mriScan/list").get(catchErrors(mriScanController.list));
router.route("/mriScan/filter").get(catchErrors(mriScanController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for IRM Scan types________________

router
  .route("/mriScanType/create")
  .post(catchErrors(mriScanTypeController.create));
router
  .route("/mriScanType/read/:id")
  .get(catchErrors(mriScanTypeController.read));
router
  .route("/mriScanType/update/:id")
  .patch(catchErrors(mriScanTypeController.update));
router
  .route("/mriScanType/delete/:id")
  .delete(catchErrors(mriScanTypeController.delete));
router
  .route("/mriScanType/search")
  .get(catchErrors(mriScanTypeController.search));
router.route("/mriScanType/list").get(catchErrors(mriScanTypeController.list));
router
  .route("/mriScanType/filter")
  .get(catchErrors(mriScanTypeController.filter));

// //______________________________________________________________________________________________________

// //_____________________________________ API for clients __________________________________________________
router.route("/client/create").post(catchErrors(clientController.create));
router.route("/client/read/:id").get(catchErrors(clientController.read));
router.route("/client/update/:id").patch(catchErrors(clientController.update));
router.route("/client/delete/:id").delete(catchErrors(clientController.delete));
router.route("/client/search").get(catchErrors(clientController.search));
router.route("/client/list").get(catchErrors(clientController.list));
router.route("/client/filter").get(catchErrors(clientController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for invoices_____________________
router.route("/invoice/create").post(catchErrors(invoiceController.create));
router.route("/invoice/read/:id").get(catchErrors(invoiceController.read));
router
  .route("/invoice/update/:id")
  .patch(catchErrors(invoiceController.update));
router
  .route("/invoice/delete/:id")
  .delete(catchErrors(invoiceController.delete));
router.route("/invoice/search").get(catchErrors(invoiceController.search));
router.route("/invoice/list").get(catchErrors(invoiceController.list));
router.route("/invoice/filter").get(catchErrors(invoiceController.filter));

router
  .route("/invoice/pdf/:id")
  .get(catchErrors(invoiceController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for items_____________________
router.route("/item/create").post(catchErrors(itemController.create));
router.route("/item/read/:id").get(catchErrors(itemController.read));
router.route("/item/update/:id").patch(catchErrors(itemController.update));
router.route("/item/delete/:id").delete(catchErrors(itemController.delete));
router.route("/item/search").get(catchErrors(itemController.search));
router.route("/item/list").get(catchErrors(itemController.list));
router.route("/item/filter").get(catchErrors(itemController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for Quotes_____________________

router.route("/quote/create").post(catchErrors(quoteController.create));
router.route("/quote/read/:id").get(catchErrors(quoteController.read));
router.route("/quote/update/:id").patch(catchErrors(quoteController.update));
router.route("/quote/delete/:id").delete(catchErrors(quoteController.delete));
router.route("/quote/search").get(catchErrors(quoteController.search));
router.route("/quote/list").get(catchErrors(quoteController.list));
router.route("/quote/filter").get(catchErrors(quoteController.filter));

router.route("/quote/pdf/:id").get(catchErrors(quoteController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for suppliers_____________________
router.route("/supplier/create").post(catchErrors(supplierController.create));
router.route("/supplier/read/:id").get(catchErrors(supplierController.read));
router
  .route("/supplier/update/:id")
  .patch(catchErrors(supplierController.update));
router
  .route("/supplier/delete/:id")
  .delete(catchErrors(supplierController.delete));
router.route("/supplier/search").get(catchErrors(supplierController.search));
router.route("/supplier/list").get(catchErrors(supplierController.list));
router.route("/supplier/filter").get(catchErrors(supplierController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for order Forms_____________________

router.route("/orderForm/create").post(catchErrors(orderFormController.create));
router.route("/orderForm/read/:id").get(catchErrors(orderFormController.read));
router
  .route("/orderForm/update/:id")
  .patch(catchErrors(orderFormController.update));
router
  .route("/orderForm/delete/:id")
  .delete(catchErrors(orderFormController.delete));
router.route("/orderForm/search").get(catchErrors(orderFormController.search));
router.route("/orderForm/list").get(catchErrors(orderFormController.list));
router.route("/orderForm/filter").get(catchErrors(orderFormController.filter));

router
  .route("/orderForm/pdf/:id")
  .get(catchErrors(orderFormController.generatePDF));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for expenses_____________________

router.route("/expense/create").post(catchErrors(expenseController.create));
router.route("/expense/read/:id").get(catchErrors(expenseController.read));
router
  .route("/expense/update/:id")
  .patch(catchErrors(expenseController.update));
router
  .route("/expense/delete/:id")
  .delete(catchErrors(expenseController.delete));
router.route("/expense/search").get(catchErrors(expenseController.search));
router.route("/expense/list").get(catchErrors(expenseController.list));
router.route("/expense/filter").get(catchErrors(expenseController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for expense categories________________

router
  .route("/expensecategory/create")
  .post(catchErrors(expenseCategoryController.create));
router
  .route("/expensecategory/read/:id")
  .get(catchErrors(expenseCategoryController.read));
router
  .route("/expensecategory/update/:id")
  .patch(catchErrors(expenseCategoryController.update));
router
  .route("/expensecategory/delete/:id")
  .delete(catchErrors(expenseCategoryController.delete));
router
  .route("/expensecategory/search")
  .get(catchErrors(expenseCategoryController.search));
router
  .route("/expensecategory/list")
  .get(catchErrors(expenseCategoryController.list));
router
  .route("/expensecategory/filter")
  .get(catchErrors(expenseCategoryController.filter));

// //______________________________________________________________________________________________________

// //_________________________________________________________________API for client payments_________________

router
  .route("/paymentClient/create")
  .post(catchErrors(paymentClientController.create));
router
  .route("/paymentClient/read/:id")
  .get(catchErrors(paymentClientController.read));
router
  .route("/paymentClient/update/:id")
  .patch(catchErrors(paymentClientController.update));
router
  .route("/paymentClient/delete/:id")
  .delete(catchErrors(paymentClientController.delete));
router
  .route("/paymentClient/search")
  .get(catchErrors(paymentClientController.search));
router
  .route("/paymentClient/list")
  .get(catchErrors(paymentClientController.list));
router
  .route("/paymentClient/filter")
  .get(catchErrors(paymentClientController.filter));
router
  .route("/paymentClient/pdf/:id")
  .get(catchErrors(paymentClientController.generatePDF));

// //_________________________________________________________________API for consultation type_________________

router
  .route("/consultationtype/create")
  .post(catchErrors(consultationTypeController.create));
router
  .route("/consultationtype/read/:id")
  .get(catchErrors(consultationTypeController.read));
router
  .route("/consultationtype/update/:id")
  .patch(catchErrors(consultationTypeController.update));
router
  .route("/consultationtype/delete/:id")
  .delete(catchErrors(consultationTypeController.delete));
router
  .route("/consultationtype/search")
  .get(catchErrors(consultationTypeController.search));
router
  .route("/consultationtype/list")
  .get(catchErrors(consultationTypeController.list));
router
  .route("/consultationtype/filter")
  .get(catchErrors(consultationTypeController.filter));

// //_________________________________________________________________API for Global Setting _________________

router
  .route("/settingGlobal/create")
  .post(catchErrors(settingGlobalController.create));
router
  .route("/settingGlobal/read/:id")
  .get(catchErrors(settingGlobalController.read));
router
  .route("/settingGlobal/update/:id")
  .patch(catchErrors(settingGlobalController.update));
router
  .route("/settingGlobal/delete/:id")
  .delete(catchErrors(settingGlobalController.delete));
router
  .route("/settingGlobal/search")
  .get(catchErrors(settingGlobalController.search));
router
  .route("/settingGlobal/list")
  .get(catchErrors(settingGlobalController.list));
router
  .route("/settingGlobal/filter")
  .get(catchErrors(settingGlobalController.filter));

// //_____________________________________________________________________________________________________________________________________________________________________________

// //_________________________________________________________________API for Medical Setting _________________
router
  .route("/settingMedical/create")
  .post(catchErrors(settingMedicalController.create));
router
  .route("/settingMedical/read/:id")
  .get(catchErrors(settingMedicalController.read));
router
  .route("/settingMedical/update/:id")
  .patch(catchErrors(settingMedicalController.update));
router
  .route("/settingMedical/delete/:id")
  .delete(catchErrors(settingMedicalController.delete));
router
  .route("/settingMedical/search")
  .get(catchErrors(settingMedicalController.search));
router
  .route("/settingMedical/list")
  .get(catchErrors(settingMedicalController.list));
router
  .route("/settingMedical/filter")
  .get(catchErrors(settingMedicalController.filter));

// //_____________________________________________________________________________________________________________________________________________________________________________

// //_________________________________________________________________API for Commercial Setting _________________

router
  .route("/settingCommercial/create")
  .post(catchErrors(settingCommercialController.create));
router
  .route("/settingCommercial/read/:id")
  .get(catchErrors(settingCommercialController.read));
router
  .route("/settingCommercial/update/:id")
  .patch(catchErrors(settingCommercialController.update));
router
  .route("/settingCommercial/delete/:id")
  .delete(catchErrors(settingCommercialController.delete));
router
  .route("/settingCommercial/search")
  .get(catchErrors(settingCommercialController.search));
router
  .route("/settingCommercial/list")
  .get(catchErrors(settingCommercialController.list));
router
  .route("/settingCommercial/filter")
  .get(catchErrors(settingCommercialController.filter));

// //_____________________________________________________________________________________________________________________________________________________________________________

// //_________________________________________________________________API for Task Setting _________________

router.route("/task/create").post(catchErrors(taskController.create));
router.route("/task/read/:id").get(catchErrors(taskController.read));
router.route("/task/update/:id").patch(catchErrors(taskController.update));
router.route("/task/delete/:id").delete(catchErrors(taskController.delete));
router.route("/task/search").get(catchErrors(taskController.search));
router.route("/task/list").get(catchErrors(taskController.list));
router.route("/task/filter").get(catchErrors(taskController.filter));

// //_________________________________________________________________API for Custom Menu _________________
router
  .route("/customMenu/create")
  .post(catchErrors(customMenuController.create));
router
  .route("/customMenu/read/:id")
  .get(catchErrors(customMenuController.read));
router
  .route("/customMenu/update/:id")
  .patch(catchErrors(customMenuController.update));
router
  .route("/customMenu/delete/:id")
  .delete(catchErrors(customMenuController.delete));
router
  .route("/customMenu/search")
  .get(catchErrors(customMenuController.search));
router.route("/customMenu/list").get(catchErrors(customMenuController.list));
router
  .route("/customMenu/filter")
  .get(catchErrors(customMenuController.filter));

// //_____________________________________________________________________________________________________________________________________________________________________________

// router.post("/account/forgot", catchErrors(authController.forgot));
// router.get("/account/reset/:token", catchErrors(authController.reset));
// router.post(
//   "/account/reset/:token",
//   authController.confirmedPasswords,
//   catchErrors(authController.update)
// );
// //____________________________________________________________________________________________________________________

// //_________________________________________________________________ uploads_______________________________
// router.get("/upload", uploadController.uploadsView);
// router.post("/upload", upload.single("imageupload"), function (req, res) {
//   res.send("File upload sucessfully.");
// });

// router.get(
//   "/permissions/admins",
//   permissionMiddleware("employees-read"),
//   permissionController.getAdmins
// );
// // this route is used to get a list of the permissions of the chosed used ( admin _id passed as a param in the link)
// router.get(
//   "/permissions/admins/:_id",
//   permissionMiddleware("employees-read"),
//   permissionController.getAdminPermissions
// );
// // this route is used to update the permissions of the selected admin ( the admin is pre selected throw the previous)
// router.post(
//   "/permissions/admins/update",
//   permissionMiddleware("employees-update"),
//   permissionController.updateAdminPermissions
// );
// //router.post('/roles',permissionMiddleware('administrator-create'), roleController.setUpAdminWithRole);

// // Hello salah, this is just a test !
// //  we can delete this later
// const mail = require("../handlers/mail");
// router.get("/emailTest", (req, res) => {
//   console.log("we in ");
//   mail.send({
//     filename: "email-layout",
//     email: "abdoumjr@gmail.com",
//     subject: "This is just a test :)",
//   });
//   res.send("Mail sent!");
// });
// // Test ends here :)

// // this is a test for queued email
// // this test will send an email in 1 minute :) just for test reasons
// const mailJob = require("../jobs/mailJob");
// router.get("/mailJobTest", (req, res) => {
//   let when = new Date();
//   // this is just for testing
//   when.setMinutes(when.getMinutes() + 1);
//   when.setHours(when.getHours() + 1);

//   // we can pass the date and time when we want our email to be sent here as "when"
//   mailJob(when);
//   res.send("Sending emails");
// });

// router.get("*", appController.notFound);

module.exports = router;
