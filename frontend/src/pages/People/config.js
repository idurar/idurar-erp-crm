export const fields = {
  firstname: {
    type: 'string',
    required: true,
  },
  lastname: {
    type: 'string',
    required: true,
  },
  company: {
    type: 'search',
    entity: 'company',
    renderAsTag: true,
    displayLabels: ['name'],
    searchFields: 'name',
    dataIndex: ['company', 'name'],
  },
  country: {
    type: 'country',
  },
  phone: {
    type: 'phone',
  },
  email: {
    type: 'email',
  },
  // bio: {
  //   type: 'string',
  // },
  // idCardNumber: {
  //   type: 'string',
  // },
  // idCardType: {
  //   type: 'string',
  // },
  // securitySocialNbr: {
  //   type: 'string',
  // },
  // taxNumber: {
  //   type: 'string',
  // },
  // birthday: {
  //   type: 'date',
  // },
  // birthplace: {
  //   type: 'string',
  // },
  // gender: {
  //   type: 'select',
  //   options: [
  //     {
  //       value: 'male',
  //       label: 'Male',
  //     },
  //     {
  //       value: 'female',
  //       label: 'Female',
  //     },
  //   ],
  // },
  // bankName: {
  //   type: 'string',
  // },
  // bankIban: {
  //   type: 'string',
  // },
  // bankSwift: {
  //   type: 'string',
  // },
  // bankNumber: {
  //   type: 'string',
  // },
  // bankRouting: {
  //   type: 'string',
  // },
  // address: {
  //   type: 'string',
  // },
  // city: {
  //   type: 'string',
  // },
  // State: {
  //   type: 'string',
  // },
  // postalCode: {
  //   type: 'number',
  // },
  // website: {
  //   type: 'string',
  // },
};
