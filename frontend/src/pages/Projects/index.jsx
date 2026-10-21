import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';

const fields = {
  number: { type: 'string', label: 'Projektnummer', required: true },
  name: { type: 'string', label: 'Projektname', required: true },
  client: {
    type: 'async',
    label: 'Kunde',
    entity: 'client',
    displayLabels: ['name'],
    outputValue: '_id',
    required: true,
  },
  status: {
    type: 'select',
    label: 'Status',
    defaultValue: 'planned',
    options: [
      { value: 'planned', label: 'Geplant' },
      { value: 'active', label: 'Aktiv' },
      { value: 'paused', label: 'Pausiert' },
      { value: 'completed', label: 'Abgeschlossen' },
      { value: 'cancelled', label: 'Storniert' },
    ],
  },
  startDate: { type: 'date', label: 'Startdatum' },
  endDate: { type: 'date', label: 'Enddatum' },
  address: { type: 'string', label: 'Einsatzort' },
  budget: { type: 'currency', label: 'Budget' },
  notes: { type: 'textarea', label: 'Notizen', disableForTable: true },
};

export default function Projects() {
  const config = {
    entity: 'project',
    fields,
    PANEL_TITLE: 'Projekte & Aufträge',
    DATATABLE_TITLE: 'Projektliste',
    ADD_NEW_ENTITY: 'Projekt anlegen',
    ENTITY_NAME: 'Projekt',
    SEARCH_PLACEHOLDER: 'Projekte suchen …',
    searchConfig: { displayLabels: ['number', 'name'], searchFields: 'number,name,address' },
    deleteModalLabels: ['number', 'name'],
  };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} isUpdateForm />} config={config} />;
}
