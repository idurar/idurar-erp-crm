const mongoose = require("mongoose");
const Model = mongoose.model("Consultation");
const crudController = require("./helpersControllers/crudController");
const custom = require("./helpersControllers/custom");

let methods = crudController.createCRUDController("Consultation");

delete methods["create"];
delete methods["update"];

function today() {
  const date = new Date();
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  const year = date.getFullYear();
  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  const fullDate = `${day}/${month}/${year}`;
  return fullDate;
}

methods.create = async (req, res) => {
  const id = req.body.consultationType;
  const consultationType = await custom.getOne("ConsultationType", id);
  req.body.total = consultationType.price;
  req.body.date = today();

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
  try {
    const { id } = req.params;
    var { consultationType: consultationTypeId, discount = 0 } = req.body;

    const consultationType = await custom.getOne(
      "ConsultationType",
      consultationTypeId
    );

    var credit = 0;
    var total = consultationType.price;

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
      body["paymentStatus"] = "paid";
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

methods.getUnpaidConsultationByPatientId = async (req, res) => {
  const { patientid, status: paymentStatus } = req.params;

  try {
    const result = await Model.where("patient", patientid).where(
      "paymentStatus",
      paymentStatus
    );

    if (result.length == 0) {
      res.status(400).json({
        success: false,
        data: [],
        message: `Unpaid consultation not found by the patientid: ${patientid}`,
      });
    }

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: `Successfully retrieved unpaid consultation by the patientid: ${patientid}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

/*
 * Consultation count for doctorid & all
 */
methods.getUnpaidConsultationCount = async (req, res) => {
  const { doctorid = null } = req.params;

  try {
    var result;
    if (doctorid) {
      result = await Model.where("doctor", doctorid)
        .where("paymentStatus", 0)
        .count();
    } else {
      result = await Model.where("paymentStatus", 0).count();
    }

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: `Successfully retrieved unpaid consultation count`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

module.exports = methods;
