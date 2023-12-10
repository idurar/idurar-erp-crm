const { migrate } = require('./migrate');

const search = async (Model, req, res) => {
  console.log('🚀 ~ file: search.js:6 ~ search ~ req.query.q :', req.query.q);
  if (req.query.q === undefined || req.query.q.trim() === '') {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
      })
      .end();
  }
  const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];

  const fields = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }
  // console.log(fields)

  let results = await Model.find(fields).where('removed', false).limit(10).exec();

  const migratedData = results.map((x) => migrate(x));

  if (results.length >= 1) {
    return res.status(200).json({
      success: true,
      result: migratedData,
      message: 'Successfully found all documents',
    });
  } else {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
      })
      .end();
  }
};

module.exports = search;
