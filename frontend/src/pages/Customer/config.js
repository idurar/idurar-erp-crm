export const fields = {
  name: {
    type: 'string',
  },
  country: {
    type: 'country',
    // color: 'red',
  },
  address: {
    type: 'string',
  },
  phone: {
    type: 'phone',
  },
  email: {
    type: 'email',
  },
  company: {
    type: 'string',
  },
  website: {
    type: 'url',
    pattern: /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(\/\S*)?$/,
  }
};
