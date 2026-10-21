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
  primaryContactRole: {
    type: 'string',
    label: 'Funktion des Ansprechpartners',
    dataPath: ['contacts', 0, 'role'],
    disableForTable: true,
  },
  secondaryContactName: {
    type: 'string',
    label: 'Weiterer Ansprechpartner',
    dataPath: ['contacts', 1, 'name'],
    disableForTable: true,
  },
  secondaryContactEmail: {
    type: 'email',
    label: 'E-Mail weiterer Ansprechpartner',
    dataPath: ['contacts', 1, 'email'],
    disableForTable: true,
  },
  address: {
    type: 'string',
    label: 'address',
    required: true,
    disableForTable: true,
  },
  postalCode: {
    type: 'string',
    label: 'postal_code',
    required: true,
  },
  city: {
    type: 'string',
    label: 'city',
    required: true,
  },
  country: {
    type: 'country',
    label: 'country',
    defaultValue: 'AT',
    required: true,
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
  billingAddress: {
    type: 'string',
    label: 'Abweichende Rechnungsadresse',
    dataPath: ['billingAddress', 'address'],
    disableForTable: true,
  },
  shippingAddress: {
    type: 'string',
    label: 'Abweichende Lieferadresse',
    dataPath: ['shippingAddress', 'address'],
    disableForTable: true,
  },
  invoiced: {
    type: 'currency',
    label: 'Fakturiert',
    disableForForm: true,
  },
  openAmount: {
    type: 'currency',
    label: 'Offen',
    disableForForm: true,
  },
  lastInvoice: {
    type: 'date',
    label: 'Letzte Rechnung',
    disableForForm: true,
  },
};
