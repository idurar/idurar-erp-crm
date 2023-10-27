import lang from '@/lang/language';

const entity = 'order'; // Keeping entity value as 'order'

const Labels = {
  PANEL_TITLE: lang.order,
  DATATABLE_TITLE: lang.order_list,
  ADD_NEW_ENTITY: lang.add_new_order,
  ENTITY_NAME: lang.order,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
