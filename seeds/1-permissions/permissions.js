/* eslint-disable */

const { getObjectId, getObjectIds } = require("../../Helpers/generateObjectId");

const list = [
  "doctors-read",
  "doctors-update",
  "doctors-delete",
  "doctors-create",

  "patients-read",
  "patients-update",
  "patients-delete",
  "patients-create",

  "employees-read",
  "employees-update",
  "employees-delete",
  "employees-create",

  "departements-read",
  "departements-update",
  "departements-delete",
  "departements-create",

  "speciality-read",
  "speciality-update",
  "speciality-delete",
  "speciality-create",

  "position-read",
  "position-update",
  "position-delete",
  "position-create",

  "appointement-read",
  "appointement-update",
  "appointement-delete",
  "appointement-create",

  "medicament-read",
  "medicament-update",
  "medicament-delete",
  "medicament-create",

  "consultation-read",
  "consultation-update",
  "consultation-delete",
  "consultation-create",

  "currencyType-read",
  "currencyType-update",
  "currencyType-delete",
  "currencyType-create",

  "preinscription-read",
  "preinscription-update",
  "preinscription-delete",
  "preinscription-create",

  "paymentMode-read",
  "paymentMode-update",
  "paymentMode-delete",
  "paymentMode-create",

  "payement-read",
  "payement-update",
  "payement-delete",
  "payement-create",

  "analysis-read",
  "analysis-update",
  "analysis-delete",
  "analysis-create",

  "analysisType-read",
  "analysisType-update",
  "analysisType-delete",
  "analysisType-create",

  "mriScan-read",
  "mriScan-update",
  "mriScan-delete",
  "mriScan-create",

  "mriScanType-read",
  "mriScanType-update",
  "mriScanType-delete",
  "mriScanType-create",

  "clients-read",
  "clients-update",
  "clients-delete",
  "clients-create",

  "invoices-read",
  "invoices-update",
  "invoices-delete",
  "invoices-create",

  "items-read",
  "items-update",
  "items-delete",
  "items-create",

  "quotes-read",
  "quotes-update",
  "quotes-delete",
  "quotes-create",

  "forms-read",
  "forms-update",
  "forms-delete",
  "forms-create",

  "expenses-read",
  "expenses-update",
  "expenses-delete",
  "expenses-create",

  "categories-read",
  "categories-update",
  "categories-delete",
  "categories-create",

  "paymentClients-read",
  "paymentClients-update",
  "paymentClients-delete",
  "paymentClients-create",
];

let permissions = list.map((item) => {
  return {
    id: getObjectId(item),
    name: item,
    displayName: {
      en: `${item} in english`,
      fr: `${item} in frensh`,
      ar: `${item} in arabic`,
    },
    isActivated: true,
  };
});

module.exports = permissions;
