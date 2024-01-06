import mongoose from 'mongoose';

const getData = (model) => {
  const Model = mongoose.model(model);
  const result = Model.find({ removed: false });
  return result;
};

const getOne = (model, id) => {
  const Model = mongoose.model(model);
  const result = Model.findOne({ _id: id, removed: false });
  return result;
};

export { getData, getOne };
