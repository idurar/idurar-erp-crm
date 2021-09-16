const mongoose = require("mongoose");
const Model = mongoose.model("LaboratoryConsultation");
const crudController = require("./helpersControllers/crudController");
// const custom = require("./helpersControllers/custom");

let methods = crudController.createCRUDController("LaboratoryConsultation");

delete methods["create"];
delete methods["update"];

// function today() {
//   const date = new Date();
//   let day = date.getDate().toString();
//   let month = (date.getMonth() + 1).toString();
//   const year = date.getFullYear();
//   if (month.length < 2) month = `0${month}`;
//   if (day.length < 2) day = `0${day}`;
//   const fullDate = `${day}/${month}/${year}`;
//   return fullDate;
// }

methods.create = async (req, res) => {
  const analysisArray = req.body.analysis || [];
  req.body.total = analysisArray.reduce(function (sum, obj) {
    return sum + obj.total;
  }, 0);
  // req.body.date = today();

  try {
    // Creating a new document in the collection
    const result = await new Model(req.body).save();

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: "Successfully Created the document in Model ",
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      res.status(400).json({
        success: false,
        result: null,
        message: "Required fields are not supplied",
      });
    } else {
      // Server Error
      res.status(500).json({
        success: false,
        result: null,
        message: "Oops there is an Error",
      });
    }
  }
};

methods.update = async (req, res) => {
  const analysisArray = req.body.analysis || [];
  let { discount = 0 } = req.body;
  let total = analysisArray.reduce(function (sum, obj) {
    return sum + obj.total;
  }, 0);
  try {
    const { id } = req.params;

    var credit = 0;

    //Calculate credited amount
    const findById = await Model.findById(id).populate("payment");

    if (findById["payment"].length > 0) {
      findById["payment"].map((payment) => {
        credit += payment.amount;
      });
    }

    let body = req.body;
    body["credit"] = credit;
    body["total"] = total;

    //Calculate payment status
    if (total - discount - credit <= 0) {
      body["paymentStatus"] = 1;
    }

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate({ _id: id }, body, {
      new: true,
    }).exec();

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: "Successfully updated the Consultation in Model",
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
