export const fields = {
  type: {
    type: 'selectwithfeedback',
    renderAsTag: true,
    options: [
      { value: 'people', label: 'people', color: 'magenta' },
      { value: 'company', label: 'company', color: 'blue' },
    ],
    required: true,
    hasFeedback: true,
  },
  name: {
    type: 'string',
    disableForForm: true,
  },
  status: {
    type: 'selectWithTranslation',
    renderAsTag: true,
    options: [
      { value: 'draft', label: 'draft' },
      { value: 'new', label: 'new', color: 'blue' },
      { value: 'won', label: 'won', color: 'green' },
      { value: 'loose', label: 'loose', color: 'red' },
      { value: 'waiting', label: 'waiting', color: 'orange' },
    ],
  },

  source: {
    type: 'selectWithTranslation',
    renderAsTag: true,
    options: [
      { value: 'linkedin', label: 'linkedin', color: 'geekblue' },
      { value: 'twitter', label: 'twitter', color: 'cyan' },
      { value: 'website', label: 'website', color: 'gold' },
      { value: 'ads', label: 'ads', color: 'purple' },
      { value: 'sales', label: 'sales', color: 'magenta' },
    ],
  },
  country: {
    type: 'country',
    color: null,
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
