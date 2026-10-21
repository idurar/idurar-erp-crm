const listAll = async (Model, req, res) => {
  const { isSafeField } = require('@/helpers/search');
  const sort = req.query.sort || 'desc';
  const enabled = req.query.enabled || undefined;
  const { filter, equal } = req.query;
  const filterCondition =
    filter && isSafeField(filter) && equal !== undefined && typeof equal !== 'object'
      ? { [filter]: equal }
      : {};

  //  Query the database for a list of all results

  let result;
  if (enabled === undefined) {
    result = await Model.find({
      removed: false,
      ...filterCondition,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  } else {
    result = await Model.find({
      removed: false,
      enabled: enabled,
      ...filterCondition,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  }

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = listAll;
