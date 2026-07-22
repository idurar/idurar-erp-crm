const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

  let fields;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  // Build filter condition safely: reject MongoDB operators in values
  let filterCondition = {};
  if (filter && equal !== undefined) {
    if (typeof equal === 'object') {
      return res.status(400).json({
        success: false,
        result: [],
        message: 'Invalid filter value',
      });
    }
    filterCondition = { [filter]: equal };
  }

  // Optional date range filter on createdAt (dateFrom / dateTo query params)
  const { dateFrom, dateTo } = req.query;
  let dateFilter = {};
  if (dateFrom || dateTo) {
    dateFilter.createdAt = {};
    if (dateFrom) {
      dateFilter.createdAt.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      dateFilter.createdAt.$lte = new Date(dateTo);
    }
  }

  //  Query the database for a list of all results
  const resultsPromise = Model.find({
    removed: false,
    ...filterCondition,
    ...dateFilter,
    ...fields,
  })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortValue })
    .populate()
    .exec();

  // Counting the total documents
  const countPromise = Model.countDocuments({
    removed: false,
    ...filterCondition,
    ...dateFilter,
    ...fields,
  });
  // Resolving both promises
  const [result, count] = await Promise.all([resultsPromise, countPromise]);

  // Calculating total pages
  const pages = Math.ceil(count / limit);

  // Getting Pagination Object
  const pagination = { page, pages, count };
  if (count > 0) {
    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      pagination,
      message: 'Collection is Empty',
    });
  }
};

module.exports = paginatedList;
