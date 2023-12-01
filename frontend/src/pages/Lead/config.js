export const fields = {
  type: {
    type: 'selectwithfeedback',
    options: [
      { value: 'people', label: 'people' },
      { value: 'company', label: 'company' },
    ],
    required: true,
    hasFeedback: true,
  },
  name: {
    type: 'string',
    disableForForm: true,
  },
  status: {
    type: 'select',
    options: [
      { value: 'draft', label: 'draft' },
      { value: 'new', label: 'new' },
      { value: 'won', label: 'won' },
      { value: 'loose', label: 'loose' },
      { value: 'waiting', label: 'waiting' },
    ],
  },
  source: {
    type: 'select',
    options: [
      { value: 'linkedin', label: 'linkedin' },
      { value: 'twitter', label: 'twitter' },
      { value: 'website', label: 'website' },
      { value: 'ads', label: 'ads' },
      { value: 'sales', label: 'sales' },
    ],
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
    label: 'people',
    entity: 'people',
    displayLabels: ['firstname', 'lastname'],
    searchFields: 'firstname,lastname',
    dataIndex: ['people', 'firstname'],
    disableForTable: true,
    feedback: 'people',
  },
  company: {
    type: 'search',
    label: 'company',
    entity: 'company',
    displayLabels: ['name'],
    searchFields: 'name',
    dataIndex: ['company', 'name'],
    disableForTable: true,
    feedback: 'company',
  },
};
