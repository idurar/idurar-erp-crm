exports.migrate = (result) => {
  const client = result.type === 'people' ? result.people : result.company;
  let newData = {};
  newData._id = result._id;
  newData.type = result.type;
  newData.name = result.name;
  newData.phone = client.phone;
  newData.email = client.email;
  newData.website = client.website;
  newData.country = client.country;
  newData.address = client.address;
  newData.people = result.people;
  newData.company = result.company;
  return newData;
};
