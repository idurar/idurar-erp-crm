import { model } from 'mongoose';

const Model = model('Setting');

const listAllSettings = async () => {
  try {
    //  Query the database for a list of all results
    const result = await Model.find({
      removed: false,
    }).exec();

    if (result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

export default listAllSettings;
