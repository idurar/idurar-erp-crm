import { migrate } from './migrate.js';

const read = async (Model, req, res) => {
  // Find document by id
  let result = await Model.findOne({ _id: req.params.id, removed: false });
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: `No document found by this id: ${req.params.id}`,
    });
  } else {
    // Return success response

    const migratedData = migrate(result);

    return res.status(200).json({
      success: true,
      result: migratedData,
      message: `we found this document by this id: ${req.params.id}`,
    });
  }
};

export default read;
