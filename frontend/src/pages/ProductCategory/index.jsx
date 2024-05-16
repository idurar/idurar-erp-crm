import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function ProductCategory() {
  const translate = useLanguage();
  const entity = 'productcategory';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = [' ', 'name'];

  const Labels = {
    PANEL_TITLE: translate('Product_Category'),
    DATATABLE_TITLE: translate('Product_Category_list'),
    ADD_NEW_ENTITY: translate('add_new_Product_Category'),
    ENTITY_NAME: translate('Product_Category'),
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
