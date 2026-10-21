import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';

const fields = {
  name: { type: 'string', label: 'Bezeichnung', required: true },
  accountCode: { type: 'string', label: 'Kontonummer' },
  description: { type: 'textarea', label: 'Beschreibung', disableForTable: true },
};
export default function ExpenseCategories() {
  const config = { entity: 'expensecategory', fields, PANEL_TITLE: 'Ausgabenkategorien', DATATABLE_TITLE: 'Kategorien', ADD_NEW_ENTITY: 'Kategorie anlegen', ENTITY_NAME: 'Kategorie', searchConfig: { displayLabels: ['name'], searchFields: 'name,accountCode' }, deleteModalLabels: ['name'] };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} isUpdateForm />} config={config} />;
}
