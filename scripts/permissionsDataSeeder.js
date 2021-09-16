const mongoose = require("mongoose");
const permission = require("../models/permission");
const { ObjectId } = require("mongodb");
const { createHash } = require("crypto");
const exec = require("await-exec");

// Returns a predictable ObjectId based on input name
const getObjectId = (name) => {
  const hash = createHash("sha1").update(name, "utf8").digest("hex");

  return new ObjectId(hash.substring(0, 24));
};

const getObjectIds = (names) => {
  return names.map((name) => getObjectId(name));
};

const mapToEntities = (names) => {
  return names.map((name) => {
    const id = getObjectId(name);

    return {
      id,
      name,
    };
  });
};

let permissionsArray = [
  "test-read",
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

let doMagic = async () => {
  console.log("Start");

  // for(let i = 0; i < permissionsArray.length;i++){

  //   let existingData = await permission.findOne({name:permissionsArray[i]})

  //   if(!existingData){

  //     let c = new permission({
  //       _id :  getObjectId(permissionsArray[i]),
  //       name : permissionsArray[i]
  //      })
  //      await c.save()
  //      console.log(JSON.stringify(tmp)+',')
  //   }
  // }

  for (let i = 0; i < permissionsArray.length; i++) {
    var query = {},
      update = {
        name: permissionsArray[i],
        _id: getObjectId(permissionsArray[i]),
        displayName: getObjectId(permissionsArray[i]),
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
      };

    // Find the document
    permission.findOneAndUpdate(query, update, options, function (
      error,
      result
    ) {
      console.log("result");
    });
  }
  console.log("End");
};

doMagic();
