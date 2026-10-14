export const fields = {
  name: {
    type: 'string',
    label: 'company_name',
    required: true,
  },
  contactName: {
    type: 'string',
    label: 'contact_person',
    groupTitle: 'contact_person',
    hideLabel: true,
    placeholder: 'first_and_last_name',
  },
  address: {
    type: 'string',
    label: 'address',
    disableForTable: true,
  },
  postalCode: {
    type: 'string',
    label: 'postal_code',
  },
  city: {
    type: 'string',
    label: 'city',
  },
  country: {
    type: 'country',
    label: 'country',
    defaultValue: 'AT',
    disableForTable: true,
  },
  phone: {
    type: 'phone',
    label: 'phone',
  },
  email: {
    type: 'email',
    label: 'email',
  },
  vatNumber: {
    type: 'string',
    label: 'vat_number',
  },
  notes: {
    type: 'textarea',
    label: 'other_note',
    disableForTable: true,
  },
  paymentTerms: {
    type: 'textarea',
    label: 'payment_terms',
    disableForTable: true,
  },
};
