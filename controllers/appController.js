const mongoose = require("mongoose");
const getData = require("./helpersControllers/custom").getData;
const getOne = require("./helpersControllers/custom").getOne;

exports.login = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.account = (req, res) => {
  res.render("account", { title: "Edit Your Account" });
};
exports.role = (req, res) => {
  res.render("role", { title: "Roles Management" });
};
exports.permission = (req, res) => {
  res.render("permission", { title: "Permissions Management" });
};
exports.admin = async (req, res) => {
  const [roles] = await Promise.all([getData("Role")]);
  res.render("admin", { title: "Admins Management", roles });
};
exports.dashboard = (req, res) => {
  res.render("index", {
    title: "Cedimed app",
  });
};
exports.dashboardDoctor = (req, res) => {
  res.render("dashboardDoctor", {
    title: "Cedimed app",
  });
};
exports.dashboardSecretariat = (req, res) => {
  res.render("dashboardSecretariat", {
    title: "Tableau de bord Secrétariat",
  });
};
exports.download = (req, res) => {
  const file = `./public/download/${req.params.pdfname}`;
  res.download(file);
};
exports.patient = (req, res) => {
  res.render("patient", {
    title: "Patients List",
  });
};

exports.employee = async (req, res) => {
  const [departmentsList, positionsList, specialtysList] = await Promise.all([
    getData("Department"),
    getData("Position"),
    getData("Specialty"),
  ]);
  res.render("employee", {
    departmentsList,
    positionsList,
    specialtysList,
    title: "employees List",
  });
};

exports.doctor = async (req, res) => {
  const [department, specialty] = await Promise.all([
    getData("Department"),
    getData("Specialty"),
  ]);
  res.render("doctor", { department, specialty, title: "doctor List" });
};

exports.department = (req, res) => {
  res.render("department", {
    title: "Departments List",
  });
};

exports.specialty = (req, res) => {
  res.render("specialty", {
    title: "specialty List",
  });
};
exports.position = (req, res) => {
  res.render("position", {
    title: "Position List",
  });
};

exports.appointment = async (req, res) => {
  const [doctor, specialty] = await Promise.all([
    getData("Doctor"),
    getData("Specialty"),
  ]);
  res.render("appointment", { specialty, title: "appointment List" });
};

exports.medicament = (req, res) => {
  res.render("medicament", {
    title: "Medicaments List",
  });
}; // YCF
/*<<<<<<< HEAD
 */ exports.laboratory = async (req, res) => {
  const [doctor, specialty] = await Promise.all([
    getData("Doctor"),
    getData("Specialty"),
  ]);
  res.render("laboratory", {
    doctor,
    specialty,
    title: "laboratory Consultation List",
  });
};

exports.analysisType = (req, res) => {
  res.render("analysisType", {
    title: "Analysis Type",
  });
};

exports.client = (req, res) => {
  res.render("client", {
    title: "client",
  });
};

exports.paymentClient = (req, res) => {
  res.render("paymentClient", {
    title: "client Payement",
  });
};
exports.consultationType = async (req, res) => {
  const [specialtys] = await Promise.all([
    // getData("Doctor"),
    getData("Specialty"),
  ]);
  res.render("consultationType", { specialtys, title: "consultation Type" });
};

exports.currency = (req, res) => {
  res.render("currencyType", {
    title: "currency Type",
  });
};

exports.expense = (req, res) => {
  res.render("expense", {
    title: "expense",
  });
};

exports.expenseCategory = (req, res) => {
  res.render("expenseCategory", {
    title: "Expense Category",
  });
};

exports.invoice = async (req, res) => {
  const [currencies] = await Promise.all([getData("Currency")]);
  res.render("invoice", { currencies, title: "invoice" });
};

exports.item = async (req, res) => {
  const [currencies] = await Promise.all([getData("Currency")]);

  res.render("item", {
    currencies,
    title: "item",
  });
};

exports.mriScan = (req, res) => {
  res.render("mriScan", {
    title: "mriScan",
  });
};

exports.mriScanType = (req, res) => {
  res.render("mriScanType", {
    title: "MRI Scan Type",
  });
};

exports.orderForm = (req, res) => {
  res.render("orderForm", {
    title: "order Form",
  });
};

exports.payment = async (req, res) => {
  const [
    paymentModes,
    doctors,
    employees,
    patients,
    currencies,
  ] = await Promise.all([
    getData("PaymentMode"),
    getData("Doctor"),
    getData("Employee"),
    getData("Patient"),
    getData("Currency"),
  ]);

  res.render("payment", {
    paymentModes,
    doctors,
    employees,
    patients,
    currencies,
    title: "payment",
  });
};

exports.paymentMode = (req, res) => {
  res.render("paymentMode", {
    title: "payment Mode",
  });
};

exports.prescription = (req, res) => {
  res.render("prescription", {
    title: "prescription",
  });
};

exports.quote = async (req, res) => {
  const [currencies, employees] = await Promise.all([
    getData("Currency"),
    getData("Employee"),
  ]);
  res.render("quote", {
    title: "quote",
    currencies,
    employees,
  });
};

exports.supplier = (req, res) => {
  res.render("supplier", {
    title: "supplier",
  });
};

exports.settingGlobal = (req, res) => {
  res.render("settingGlobal", {
    title: "Global setting",
  });
};

exports.settingMedical = (req, res) => {
  res.render("settingMedical", {
    title: "Medical setting",
  });
};

exports.settingCommercial = (req, res) => {
  res.render("settingCommercial", {
    title: "Commercial setting",
  });
};

exports.recordAudio = (req, res) => {
  res.render("recordAudio", {
    title: "Record Audio",
  });
};
exports.customMenu = (req, res) => {
  res.render("customMenu", {
    title: "Custom Menu",
  });
};

exports.task = (req, res) => {
  res.render("task", {
    title: "Task",
  });
};
/*=======
 */
exports.consultation = async (req, res) => {
  const Model = mongoose.model("ConsultationType");

  const doctorParam = req.params.doctorParam || null;
  let doctor = 0;
  let idSpecialty = null;
  let consultationTypes = [];

  if (doctorParam != null) {
    doctor = await getOne("Doctor", doctorParam);

    if (doctor != null) {
      idSpecialty = doctor.specialty._id;
      consultationTypes = await Model.find()
        .where("specialty")
        .equals(idSpecialty);
      // doctors.push(doctor);
    }
  }

  res.render("consultation", {
    consultationTypes,
    doctor,
    title: "consultation",
  });
};

exports.notFound = (req, res) => {
  res.status(404);
  res.render("errors/404", {
    title: "Not Found",
  });
};
