import mongoose from 'mongoose';

const search = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  if (!req.query.q || req.query.q.trim() === '') {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
      })
      .end();
  }

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name', 'surname', 'email'];

  const fields = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  let result = await User.find(fields)
    .where('removed', false)
    .sort({ name: 'asc' })
    .limit(10)
    .exec();

  if (result.length >= 1) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(202).json({
      success: false,
      result: [],
      message: 'No document found by this request',
    });
  }
};

export default search;
