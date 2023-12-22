const migrate = (result) => {
  let lead = result.type === 'people' ? result.people : result.company;
  let newData = {
    _id: result._id,
    type: result.type,
    status: result.status,
    source: result.source,
    name: result.name,
    phone: lead.phone,
    email: lead.email,
    website: lead.website,
    country: lead.country,
    address: lead.address,
    people: result.people,
    company: result.company,
  };
  return newData;
};

export { migrate };
