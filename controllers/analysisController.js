const mongoose = require("mongoose");
const Model = mongoose.model("Analysis");
const crudController = require("./helpersControllers/crudController");
// const custom = require('./helpersControllers/custom');

let methods = crudController.createCRUDController("Analysis");

delete methods["update"];
// delete methods["create"];

// methods.create = async (req, res) => {
//   try {
//     // Creating a new document in the collection
//     const result = await new Model(req.body).save();

//     // Returning successfull response
//     res.status(200).json({
//       success: true,
//       result,
//       message: "Successfully Created the document in Model ",
//     });

//     const { _id: prescriptionId } = result;
//     const consultationId = result.consultation._id;
//     await Consultation.findByIdAndUpdate(
//       { _id: consultationId },
//       {
//         $push: { prescription: prescriptionId },
//       }
//     ).exec();

//     await custom.generatePdf(
//       "Prescription",
//       { filename: "prescription-report", format: "A5" },
//       result
//     );
//     // await custom.generatePdf('Prescription', { filename: 'prescription-report', format:'A5' }, result, function (callback) {
//     //   // if (callback.hasOwnProperty('success') && callback.success) {
//     //   //     let { data } = callback;
//     //   // }
//     // });
//   } catch (err) {
//     console.log(err);
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
methods.update = async (req, res) => {
  try {
    const { id } = req.params;

    var total = 0;

    let body = req.body;

    //Calculate credited amount
    const findById = await Model.findById(id).populate(
      "analysesList.analysisType"
    );

    if (findById["analysesList"].length > 0) {
      findById["analysesList"].map((analysis) => {
        total += analysis.analysisType.price;
      });
    }

    body["total"] = total;

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: id }, body, {
      new: true,
    }).exec();

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: "Successfully updated the Analysis in Model",
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      return res.status(400).json({
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

module.exports = methods;
