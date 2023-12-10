const read = async (Model, req, res) => {
  // Find document by id
  const result = await Model.findOne({ _id: req.params.id, removed: false })
    .populate('company', 'name')
    .exec();
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found by this id: ' + req.params.id,
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'we found this document by this id: ' + req.params.id,
    });
  }
};

module.exports = read;
