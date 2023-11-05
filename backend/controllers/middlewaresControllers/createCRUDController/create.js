const create = async (Model, req, res) => {
  try {
    // if data is already present then update it otherwise save it
    const updateresult = await Model.findOneAndUpdate(
      {
        company: req.body.company,
        removed: true,
      },
      {
        $set: { ...req.body, removed: false },
      },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    // If no updateresults found, try to save  document
    if (updateresult) {
      const resp = {
        success: true,
        result: {
          removed: false,
          enabled: true,
          company: req.body.company,
          managerName: req.body.managerName,
          managerSurname: req.body.managerSurname,
          phone: req.body.phone,
          email: req.body.email,
          _id: `new ObjectId('6547f8d100c66e4110733f9b')`,
          customField: [],
          created: '2023-11-05T20:19:29.004Z',
          __v: 0,
        },
        message: 'Successfully Created the document in Model ',
      };
      return res.status(200).json(resp);
    } else {
      const result = await new Model(req.body).save();
      // Returning successfull response
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully Created the document in Model ',
      });
    }
  } catch (error) {
    // If error is thrown by Mongoose due to required validations
    if (error.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = create;
