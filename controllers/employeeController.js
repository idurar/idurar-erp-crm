const mongoose = require("mongoose");
const Model = mongoose.model("Employee");
const Admin = mongoose.model("Admin");
const crudController = require("./helpersControllers/crudController");

let methods = crudController.createCRUDController("Employee");

delete methods["update"];

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

methods.update = async (req, res) => {
  try {
    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      req.body,
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();

    let { _id, name, surname } = result;

    let updates = {
      name: name,
      surname: surname,
    };

    // Find document by id and updates with the required fields
    await Admin.findOneAndUpdate(
      { employee: _id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();

    return res.status(200).json({
      success: true,
      result,
      message: "we update this document by this id: " + req.params.id,
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
