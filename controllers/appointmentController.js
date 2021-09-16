const mongoose = require("mongoose");
const Model = mongoose.model("Appointment");
const custom = require("./helpersControllers/custom");
const moment = require("moment");

const crudController = require("./helpersControllers/crudController");
methods = crudController.createCRUDController("Appointment");

methods.getAppointmentCountByDoctorId = async (req, res) => {
  const { doctorid, status } = req.params;

  try {
    const today = moment().format("DD/MM/YYYY");
    const result = await Model.where("doctor", doctorid)
      .where("date", today)
      .where("status", status)
      .count();

    res.status(200).json({
      success: true,
      result,
      message: "Successfully found the doctor appointment counts",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

methods.getAllAppointmentCount = async (req, res) => {
  const { status } = req.params;

  try {
    const today = moment().format("DD/MM/YYYY");
    const result = await Model.where("date", today)
      .where("status", status)
      .count();

    res.status(200).json({
      success: true,
      result,
      message: "Successfully found all appointment counts",
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
