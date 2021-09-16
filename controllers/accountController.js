// const promisify = require("es6-promisify");

const mongoose = require("mongoose");
const Model = mongoose.model("Admin");
const crudController = require("./helpersControllers/crudController");
// const custom = require("./helpersControllers/custom");

let methods = crudController.createCRUDController("Admin");

delete methods["create"];
delete methods["update"];

exports.create = async (req, res) => {
  try {
    // Creating a new document in the collection

    const exist = await Model.findOne({ email: req.body.email });
    console.log(`exist Admin value : ${exist}`);
    if (exist === null) {
      const result = await new Model(req.body).save();

      // Returning successfull response
      res.status(200).json({
        success: true,
        result,
        message: "Successfully Created the document in Model ",
      });
    } else {
      res.status(400).json({
        success: true,
        result: null,
        message: `Admin Exist with this mail : ${req.body.email} `,
      });
    }
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

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

exports.update = async (req, res) => {
  try {
    const exist = await Model.findOne({ email: req.body.email });
    if (exist === null) {
      // Find document by id and updates with the required fields
      const result = await Model.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true, // return the new result instead of the old one
          runValidators: true,
        }
      ).exec();

      res.status(200).json({
        success: true,
        result,
        message: "we update this document by this id: " + req.params.id,
      });
    } else {
      res.status(400).json({
        success: true,
        result: null,
        message: `Admin Exist with this mail : ${req.body.email} `,
      });
    }
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
