/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require("fs");
const mongoose = require("mongoose");

const getData = require("./controllers/helpersControllers/custom").getData;

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require("moment");

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
exports.staticMap = ([lng, lat]) =>
  `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = (name) => {
  try {
    return fs.readFileSync(`./public/images/icons/${name}.svg`);
  } catch (error) {
    return null;
  }
};
exports.image = (name) => fs.readFileSync(`./public/images/photos/${name}.jpg`);

exports.adminPhotoUrl = (admin) => {
  if (admin) {
    return admin.photo ? "/" + admin.photo : "/images/photos/profile.jpg";
  } else {
    return "/images/photos/profile.jpg";
  }
};

// Some details about the site
exports.siteName = `Express.js / MongoBD / Rest Api`;

exports.timeRange = (start, end, format, interval) => {
  if (format == undefined) {
    format = "HH:mm";
  }

  if (interval == undefined) {
    interval = 60;
  }
  interval = interval > 0 ? interval : 60;

  const range = [];
  while (moment(start).isBefore(moment(end))) {
    range.push(moment(start).format(format));
    start = moment(start).add(interval, "minutes");
  }
  return range;
};

exports.lists = [
  "01 - Adrar",
  "02 - Chlef",
  "03 - Laghouat",
  "04 - Oum el-Bouaghi",
  "05 - Batna",
  "06 - Béjaïa",
  "07 - Biskra",
  "08 - Béchar",
  "09 - Blida",
  "10 - Bouïra",
  "11 - Tamanghasset",
  "12 - Tébessa",
  "13 - Tlemcen",
  "14 - Tiaret",
  "15 - Tizi Ouzou",
  "16 - Alger",
  "17 - Djelfa",
  "18 - Jijel",
  "19 - Sétif",
  "20 - Saïda",
  "21 - Skikda",
  "22 - Sidi Bel Abbès",
  "23 - Annaba",
  "24 - Guelma",
  "25 - Constantine",
  "26 - Médéa",
  "27 - Mostaganem",
  "28 - Msila",
  "29 - Mascara",
  "30 - Ouargla",
  "31 - Oran",
  "32 - El Bayadh",
  "33 - Illizi",
  "34 - Bordj Bou Arréridj",
  "35 - Boumerdès",
  "36 - El Taref",
  "37 - Tindouf",
  "38 - Tissemsilt",
  "39 - El Oued",
  "40 - Khenchela",
  "41 - Souk Ahras",
  "42 - Tipaza",
  "43 - Mila",
  "44 - Aïn Defla",
  "45 - Naâma",
  "46 - Aïn Témouchent",
  "47 - Ghardaïa",
  "48 - Relizane",
];

exports.menu = [
  {
    slug: "/consultation/5f9dab87012603af2f0a6d01",
    title: "Consultations",
    icon: "dashboard",
  },
  { slug: "/patient", title: "Patients", icon: "patients" },
  { slug: "/appointment", title: "Appointment", icon: "appointment" },
  // {
  //   slug: "/consultation/5f9dab87012603af2f0a6d01",
  //   title: "Consultation",
  //   icon: "accounting",
  // },
  // { slug: "/mriscan", title: "IRM Scanner", icon: "accounting" },
  // { slug: "/laboratory", title: "Laboratory", icon: "laboratory" },
  // { slug: "/payment", title: "Paiement", icon: "accounting" },
  {
    slug: "#",
    title: "Medical Parametres",
    icon: "settings",
    submenu: [
      {
        slug: "/consultationType",
        title: "Type de Consultation",
        icon: "settings",
      },
      { slug: "/analysisType", title: "Type des analyses", icon: "settings" },
      { slug: "/mriScanType", title: "Type RMI & Scanner", icon: "settings" },
      {
        slug: "/medicalsettings",
        title: "Parametres Medical",
        icon: "settings",
      },
    ],
  },

  {
    slug: "#",
    title: "Ressource Humaine",
    icon: "patients",
    submenu: [
      { slug: "/employee", title: "Employes", icon: "patients" },
      { slug: "/doctor", title: "Doctors", icon: "patients" },
      // {
      //   slug: "/employeecontract",
      //   title: "Contrat Employee",
      //   icon: "patients",
      // },
      // { slug: "/salary", title: "Contrat de Salaire", icon: "accounting" },
      // { slug: "/medicalsettings", title: "RH Parametres", icon: "patients" },
    ],
  },

  // {
  //   slug: "#",
  //   title: "Gestion Commercial",
  //   icon: "accounting",
  //   submenu: [
  //     { slug: "/customer", title: "Client", icon: "accounting" },
  //     { slug: "/supplier", title: "Fournisseur", icon: "accounting" },
  //     { slug: "/invoice", title: "Facture", icon: "accounting" },
  //     { slug: "/quote", title: "Devis", icon: "accounting" },
  //     { slug: "/orderform", title: "Bon de commande", icon: "accounting" },
  //     { slug: "/paymentInvoice", title: "Regelement", icon: "accounting" },
  //     { slug: "/expenses", title: "Depences", icon: "accounting" },
  //     {
  //       slug: "/financesettings",
  //       title: "Finance Parametres",
  //       icon: "patients",
  //     },
  //   ],
  // },

  // { slug: "/rapport", title: "Rapport", icon: "settings" },
  // {
  //   slug: "javascript:",
  //   title: "Parametres",
  //   icon: "settings",
  //   class: "has-sub-menu-drawer",
  //   submenu: [
  //     {
  //       slug: "/generalsettings",
  //       title: "Generale Parametres",
  //       icon: "settings",
  //     },
  //     {
  //       slug: "/settingCommercial",
  //       title: "Commercial Parametres",
  //       icon: "settings",
  //     },
  //     {
  //       slug: "/financesettings",
  //       title: "Finance Parametres",
  //       icon: "settings",
  //     },
  //   ],
  // },
];

exports.settingCommercial = async (name) => {
  try {
    const Model = mongoose.model("SettingCommercial");
    const result = await Model.findOne({ name: name });
    if (result) {
      return await result.value;
    }
    return null;
  } catch (err) {
    console.log("setting fetch failed", err);
  }
};

exports.settingGlobal = async (name) => {
  try {
    const Model = mongoose.model("SettingGlobal");
    const result = await Model.findOne({ name: name });
    if (result) {
      return await result.value;
    }
    return null;
  } catch (err) {
    console.log("setting fetch failed", err);
  }
};

exports.settingMedical = async (name) => {
  try {
    const Model = mongoose.model("SettingMedical");
    const result = await Model.findOne({ name: name });
    if (result) {
      return await result.value;
    }
    return null;
  } catch (err) {
    console.log("setting fetch failed", err);
  }
};

// const settingCommercial = () => {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			resolve(getData('SettingCommercial'));
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// }

// const settingGlobal = () => {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			resolve(getData('SettingGlobal'));
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// }

// const settingMedical = () => {
// 	return new Promise( (resolve, reject) => {
// 		try {
// 			resolve(getData('SettingMedical'));
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// }

/**
 * Medical` settings
 */
// module.exports.settings = async (callback) => {
// 	var settings = {}

// 	await settingCommercial().then(function (data) {
// 		settings['commercial'] = data;
// 	});

// 	await settingGlobal().then(function (data) {
// 		settings['global'] = data;
// 	});

// 	await settingMedical().then(function (data) {
// 		settings['medical'] = data;
// 	});

// 	callback(settings);
// }
