const mongoose = require("mongoose");
const Patient = mongoose.model("Patient");
const crudController = require("./helpersControllers/crudController");

let methods = crudController.createCRUDController("Patient");
delete methods["create"];
// delete methods["update"];

methods.create = async (req, res) => {
  try {
    const { sexe, birthday } = req.body;

    // Gender Code
    const genderCode = sexe === "Homme" ? "1" : "2";

    // Birthday Code
    const day = birthday.slice(0, 2);
    const month = birthday.slice(3, 5);
    const year = birthday.slice(8, 10);
    const birthdayCode = `${year}${month}${day}`;

    // Birthday State Code
    let birthdayStateCode;

    birthdayStateCode = req.body.birthplace || 99;
    // Current Date Code

    const currentDate = new Date();
    console.log(currentDate);
    const yearCode = currentDate.getFullYear();
    const currentYear = yearCode.toString().slice(2, 4);
    let currentMonth = (currentDate.getMonth() + 1).toString();
    if (currentMonth.length < 2) currentMonth = `0${currentMonth}`;

    // Today Date Code
    const currentDateCode = `${currentMonth}${currentYear}`;

    // Genrating PatientID
    const patientId = `${genderCode}${birthdayCode}${birthdayStateCode}${currentDateCode}1`;

    req.body.patientId = patientId;

    // Finding if patient is already with the same PatientID
    const isSamePatientID = await Patient.findOne({
      patientId: req.body.patientId,
    });

    // If same found, incremnt with n + 1
    if (isSamePatientID)
      req.body.patientID = req.body.patientID.replace(/\d+$/, function (n) {
        return parseInt(n) + 1;
      });

    // Creating a new document in the collection
    const result = await new Patient(req.body).save();

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result,
      message: "Successfully Created the document in Patient ",
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      return res.status(403).json({
        success: false,
        result: null,
        message: "Required fields are not supplied",
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: "Oops there is an Error",
      });
    }
  }
};

// methods.update = async (req, res) => {
//   try {
//     const { sexe, birthday } = req.body;

//     // Gender Code
//     const genderCode = sexe === "Homme" ? "1" : "2";

//     console.log(genderCode);
//     // Birthday Code
//     const day = birthday.slice(0, 2);
//     const month = birthday.slice(3, 5);
//     const year = birthday.slice(8, 10);
//     const birthdayCode = `${year}${month}${day}`;
//     console.log(birthdayCode);

//     // Birthday State Code
//     let birthdayStateCode;

//     // Finding a state matched in list of states
//     // console.log(states.lists);
//     // const matches = states.lists.filter(state => state.includes(req.body.birthday));
//     // console.log(matches);

//     // if (!matches) birthdayStateCode = '99';
//     // else birthdayStateCode = matches.toString().slice(0, 2);
//     birthdayStateCode = req.body.birthplace || 99;
//     // Current Date Code
//     console.log(birthdayStateCode);

//     const currentDate = new Date();
//     console.log(currentDate);
//     const yearCode = currentDate.getFullYear();
//     const currentYear = yearCode.toString().slice(2, 4);
//     let currentMonth = (currentDate.getMonth() + 1).toString();
//     if (currentMonth.length < 2) currentMonth = `0${currentMonth}`;

//     // Today Date Code
//     const currentDateCode = `${currentMonth}${currentYear}`;
//     console.log(currentDateCode);
//     // Genrating PatientID
//     const patientId = `${genderCode}${birthdayCode}${birthdayStateCode}${currentDateCode}1`;
//     console.log(patientId);
//     req.body.patientId = patientId;

//     // Finding if patient is already with the same PatientID
//     const isSamePatientID = await Patient.findOne({
//       patientId: req.body.patientId,
//     });
//     console.log(isSamePatientID);
//     // If same found, incremnt with n + 1
//     if (isSamePatientID)
//       req.body.patientID = req.body.patientID.replace(/\d+$/, function (n) {
//         return parseInt(n) + 1;
//       });

//     // Find document by id and updates with the required fields
//     const result = await Patient.findOneAndUpdate(
//       { _id: req.params.id },
//       req.body,
//       {
//         new: true, // return the new result instead of the old one
//         runValidators: true,
//       }
//     ).exec();

//     res.status(200).json({
//       success: true,
//       result,
//       message: "we update this document by this id: " + req.params.id,
//     });
//   } catch (err) {
//     // If err is thrown by Mongoose due to required validations
//     if (err.name == "ValidationError") {
//       res.status(400).json({
//         success: false,
//         result: null,
//         message: "Required fields are not supplied",
//       });
//     } else {
//       // Server Error
//       res.status(500).json({
//         success: false,
//         result: null,
//         message: "Oops there is an Error",
//       });
//     }
//   }
// };
module.exports = methods;
