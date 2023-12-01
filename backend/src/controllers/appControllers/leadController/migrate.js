exports.migrate = (result) => {
  let lead = result.type === 'people' ? result.people : result.company;
  let newData = {};
  newData._id = result._id;
  newData.type = result.type;
  newData.status = result.status;
  newData.source = result.source;
  newData.name = result.name;
  newData.phone = lead.phone;
  newData.email = lead.email;
  newData.website = lead.website;
  newData.country = lead.country;
  newData.address = lead.address;
  newData.people = result.people;
  newData.company = result.company;
  return newData;
};
