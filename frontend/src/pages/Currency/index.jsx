import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Currency() {
  const translate = useLanguage();
  const entity = 'currency';
  const searchConfig = {
    displayLabels: ['currency_name', 'currency_code', 'currency_symbol'],
    searchFields: 'currency_name,currency_code,currency_symbol',
  };
  const deleteModalLabels = [' ', 'currency_name'];

  const Labels = {
    PANEL_TITLE: translate('currency'),
    DATATABLE_TITLE: translate('currency_list'),
    ADD_NEW_ENTITY: translate('add_new_currency'),
    ENTITY_NAME: translate('currency'),
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
