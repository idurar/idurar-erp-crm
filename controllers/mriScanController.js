const mongoose = require("mongoose");
const Model = mongoose.model("MRIScan");
const crudController = require("./helpersControllers/crudController");
const custom = require("./helpersControllers/custom");

let methods = crudController.createCRUDController("MRIScan");

delete methods["update"];

methods.update = async (req, res) => {
  try {
    const { id } = req.params;
    var { discount = 0 } = req.body;

    var credit = 0;
    var total = 0;

    let body = req.body;
    body["credit"] = credit;
    body["total"] = total;

    // Find document by id and updates with the required fields
    await Model.findOneAndUpdate({ _id: id }, body, {
      new: true,
    }).exec();

    //Calculate credited amount
    const findById = await Model.findById(id)
      .populate("payment")
      .populate("mriScansList.mriScanType");
    if (findById["payment"].length > 0) {
      findById["payment"].map((payment) => {
        credit += payment.amount;
      });
    }

    if (findById["mriScansList"].length > 0) {
      findById["mriScansList"].map((analysis) => {
        total += analysis.mriScanType.price;
      });
    }

    let update = {};
    update["credit"] = credit;
    update["total"] = total;

    //Calculate payment status
    if (total - discount - credit <= 0) {
      update["paymentStatus"] = "paid";
    }

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: id }, update, {
      new: true,
    }).exec();

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: "Successfully updated the MRIScan in Model",
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
