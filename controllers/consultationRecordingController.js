const mongoose = require("mongoose");
const Model = mongoose.model("ConsultationRecording");
const Consultation = mongoose.model("Consultation");

const crudController = require("./helpersControllers/crudController");
let methods = crudController.createCRUDController("ConsultationRecording");

delete methods["create"];

methods.create = async (req, res) => {
  try {
    // Creating a new document in the collection
    const result = await new Model(req.body).save();

    // Returning successfull response
    res.status(200).json({
      success: true,
      result,
      message: "Successfully Created the document in Model ",
    });

    const { _id: reordingId } = result;
    const consultationId = result.consultation._id;
    await Consultation.findByIdAndUpdate(
      { _id: consultationId },
      {
        $push: { audioFile: reordingId },
      }
    ).exec();
  } catch (err) {
    console.log(err);
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
