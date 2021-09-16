const mongoose = require("mongoose");
const Payment = mongoose.model("Payment");

const Consultation = mongoose.model("Consultation");
const Analysis = mongoose.model("Analysis");
const MRIScan = mongoose.model("MRIScan");

const crudController = require("./helpersControllers/crudController");
const custom = require("./helpersControllers/custom");

const methods = crudController.createCRUDController("Payment");

delete methods["create"];
delete methods["update"];

methods.create = async (req, res) => {
  try {
    const {
      forAnalysis = false,
      forMRIScan = false,
      forConsultation = false,
    } = req.body;

    // Creating a new payment in the collection
    const result = await new Payment(req.body).save();
    const { id: paymentId } = result;

    //***** should fix this controller -- should fix this controller -- should fix this controller ******/

    // const { _id: prescriptionId } = result;
    // const consultationId = result.consultation._id;
    // await Consultation.findByIdAndUpdate({ _id: consultationId }, {
    //     $push: { "prescription": prescriptionId }
    // }).exec();

    if (forConsultation) {
      const { consultation: consultationId } = result;

      Consultation.findByIdAndUpdate(
        { _id: consultationId },
        {
          $push: { payment: paymentId },
        }
      ).exec(function (err, success) {
        if (err) {
          // Server Error
          res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
          });
        }
      });
    }

    if (forAnalysis) {
      const { analysis: analysisId } = result;

      Analysis.findByIdAndUpdate(
        { _id: analysisId },
        {
          $push: { payment: paymentId },
        }
      ).exec(function (err, success) {
        if (err) {
          // Server Error
          res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
          });
        }
      });
    }

    if (forMRIScan) {
      const { mriScan: mriScanId } = result;

      MRIScan.findByIdAndUpdate(
        { _id: mriScanId },
        {
          $push: { payment: paymentId },
        }
      ).exec(function (err, success) {
        if (err) {
          // Server Error
          res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
          });
        }
      });
    }

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: "Successfully Created the payment in Model",
    });
  } catch (error) {
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
    const {
      forAnalysis = false,
      forMRIScan = false,
      forConsultation = false,
    } = req.body;
    const { id: paymentId } = req.params;

    // Find document by id and updates with the required fields
    const result = await Payment.findOneAndUpdate(
      { _id: paymentId },
      req.body,
      {
        new: true,
      }
    ).exec();

    if (forConsultation) {
      const { consultation: consultationId } = result;

      Consultation.findByIdAndUpdate(
        { _id: consultationId },
        {
          $push: { payment: paymentId },
        }
      ).exec(function (err, success) {
        if (err) {
          // Server Error
          res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
          });
        }
      });
    }

    if (forAnalysis) {
      const { analysis: analysisId } = result;

      Analysis.findByIdAndUpdate(
        { _id: analysisId },
        {
          $push: { payment: paymentId },
        }
      ).exec(function (err, success) {
        if (err) {
          // Server Error
          res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
          });
        }
      });
    }

    if (forMRIScan) {
      const { mriScan: mriScanId } = result;

      MRIScan.findByIdAndUpdate(
        { _id: mriScanId },
        {
          $push: { payment: paymentId },
        }
      ).exec(function (err, success) {
        if (err) {
          // Server Error
          res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
          });
        }
      });
    }

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: "Successfully Updated the payment in Model",
    });
  } catch (error) {
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

module.exports = methods;
