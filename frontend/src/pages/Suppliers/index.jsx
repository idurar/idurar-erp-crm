import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';

const fields = {
  supplierNumber: { type: 'string', label: 'Lieferantennummer' },
  name: { type: 'string', label: 'Firmenname', required: true },
  contactName: { type: 'string', label: 'Ansprechperson' },
  email: { type: 'email', label: 'E-Mail' },
  phone: { type: 'phone', label: 'Telefon' },
  address: { type: 'string', label: 'Adresse', disableForTable: true },
  postalCode: { type: 'string', label: 'PLZ' },
  city: { type: 'string', label: 'Ort' },
  country: { type: 'country', label: 'Land', defaultValue: 'AT', disableForTable: true },
  vatNumber: { type: 'string', label: 'UID-Nummer' },
  paymentTerms: { type: 'textarea', label: 'Zahlungskonditionen', disableForTable: true },
  notes: { type: 'textarea', label: 'Notizen', disableForTable: true },
};

export default function Suppliers() {
  const config = {
    entity: 'supplier', fields, PANEL_TITLE: 'Lieferanten', DATATABLE_TITLE: 'Lieferantenliste',
    ADD_NEW_ENTITY: 'Lieferant anlegen', ENTITY_NAME: 'Lieferant', SEARCH_PLACEHOLDER: 'Lieferanten suchen …',
    searchConfig: { displayLabels: ['name'], searchFields: 'name,supplierNumber,email,vatNumber' }, deleteModalLabels: ['name'],
  };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} isUpdateForm />} config={config} />;
}
