import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Expense() {
  const translate = useLanguage();
  const entity = 'expense';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = [' ', 'name'];

  const Labels = {
    PANEL_TITLE: translate('Expense'),
    DATATABLE_TITLE: translate('Expense_list'),
    ADD_NEW_ENTITY: translate('add_new_Expense'),
    ENTITY_NAME: translate('Expense'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}
