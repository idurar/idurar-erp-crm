export const fields = {
  type: {
    type: 'select',
    options: [
      { value: 'people', label: 'people' },
      { value: 'company', label: 'company' },
    ],
    required: true,
  },
  name: {
    type: 'string',
    disableForForm: true,
  },
  country: {
    type: 'country',
    color: 'red',
    disableForForm: true,
  },
  phone: {
    type: 'phone',
    disableForForm: true,
  },
  email: {
    type: 'email',
    disableForForm: true,
  },
  people: {
    type: 'search',
    label: 'person',
    entity: 'people',
    displayLabels: ['firstname', 'lastname'],
    searchFields: 'firstname,lastname',
    dataIndex: ['people', 'firstname'],
    disableForTable: true,
  },
  company: {
    type: 'search',
    label: 'company',
    entity: 'company',
    displayLabels: ['name'],
    searchFields: 'name',
    dataIndex: ['company', 'name'],
    disableForTable: true,
  },
};
