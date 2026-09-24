import { model as _model } from 'mongoose';
export function getData({ model }) {
  const Model = _model(model);
  const result = Model.find({ removed: false, enabled: true });
  return result;
}

export function getOne({ model, id }) {
  const Model = _model(model);
  const result = Model.findOne({ _id: id, removed: false });
  return result;
}
