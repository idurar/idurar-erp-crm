const update = async (Model, req, res) => {
  // Find document by id and updates with the required fields

  const updates = { ...req.body };

  if (updates.hasOwnProperty('removed')) {
    delete updates.removed;
  }

  if (updates.hasOwnProperty('currency_code')) {
    delete updates.currency_code;
  }

  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, updates, {
    new: true, // return the new result instead of the old one
    runValidators: true,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document ',
    });
  }
};

module.exports = update;
