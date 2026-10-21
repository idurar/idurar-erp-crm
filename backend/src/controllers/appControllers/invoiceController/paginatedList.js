const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');
const { deriveInvoiceStatus } = require('@/helpers/invoice');
const { escapeRegex, isSafeField } = require('@/helpers/search');

const paginatedList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const { sortBy = 'created', sortValue = -1, filter, equal } = req.query;

  const fieldsArray = (req.query.fields ? req.query.fields.split(',') : []).filter(isSafeField);

  let fields;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(escapeRegex(req.query.q || ''), 'i') } });
  }

  //  Query the database for a list of all results
  let filterCondition = {};
  if (filter === 'documentStatus' && equal !== undefined) {
    filterCondition.issuedAt = equal === 'issued' ? { $ne: null } : null;
  } else if (filter === 'recurrenceStatus' && equal !== undefined) {
    if (equal === 'active') filterCondition.recurringActive = true;
    if (equal === 'paused') {
      filterCondition.recurringActive = false;
      filterCondition.recurring = { $nin: [null, 'none'] };
    }
    if (equal === 'once') filterCondition.recurring = { $in: [null, 'none'] };
  } else if (filter && isSafeField(filter) && equal !== undefined) {
    filterCondition = { [filter]: equal };
  }
  if (req.query.paymentStatus) filterCondition.paymentStatus = req.query.paymentStatus;
  if (req.query.status) filterCondition.status = req.query.status;
  if (req.query.dateFrom || req.query.dateTo) {
    filterCondition.date = {};
    if (req.query.dateFrom) filterCondition.date.$gte = new Date(req.query.dateFrom);
    if (req.query.dateTo) filterCondition.date.$lte = new Date(`${req.query.dateTo}T23:59:59.999Z`);
  }

  const resultsPromise = Model.find({
    removed: false,
    ...filterCondition,
    ...fields,
  })
    .skip(skip)
    .limit(limit)
    .sort({ [isSafeField(sortBy) ? sortBy : 'created']: Number(sortValue) === 1 ? 1 : -1 })
    .populate('createdBy', 'name')
    .exec();

  // Counting the total documents
  const countPromise = Model.countDocuments({
    removed: false,

    ...filterCondition,
    ...fields,
  });

  // Resolving both promises
  const [documents, count] = await Promise.all([resultsPromise, countPromise]);
  const now = new Date();
  const result = documents.map((document) => {
    const item = document.toObject();
    item.isOverdue = item.paymentStatus !== 'paid' && new Date(item.expiredDate) < now;
    item.status = deriveInvoiceStatus(item);
    return item;
  });
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
