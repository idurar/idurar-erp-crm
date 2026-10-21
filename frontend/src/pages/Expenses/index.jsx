import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';

const fields = {
  number: { type: 'string', label: 'Belegnummer', required: true },
  date: { type: 'date', label: 'Belegdatum', required: true },
  supplier: { type: 'async', label: 'Lieferant', entity: 'supplier', displayLabels: ['name'], outputValue: '_id' },
  project: { type: 'async', label: 'Kommission / Projekt', entity: 'project', displayLabels: ['number', 'name'], outputValue: '_id' },
  category: { type: 'async', label: 'Kategorie', entity: 'expensecategory', displayLabels: ['name'], outputValue: '_id', required: true },
  description: { type: 'string', label: 'Beschreibung', required: true },
  netAmount: { type: 'currency', label: 'Netto', required: true },
  taxRate: { type: 'number', label: 'Steuersatz %', defaultValue: 20 },
  grossAmount: { type: 'currency', label: 'Brutto', disableForForm: true },
  paid: { type: 'boolean', label: 'Bezahlt', defaultValue: false },
  reference: { type: 'string', label: 'Referenz', disableForTable: true },
};
export default function Expenses() {
  const config = { entity: 'expense', fields, PANEL_TITLE: 'Ausgaben', DATATABLE_TITLE: 'Ausgabenliste', ADD_NEW_ENTITY: 'Ausgabe erfassen', ENTITY_NAME: 'Ausgabe', searchConfig: { displayLabels: ['number', 'description'], searchFields: 'number,description,reference' }, deleteModalLabels: ['number', 'description'] };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} isUpdateForm />} config={config} />;
}
