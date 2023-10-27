import lang from '@/lang/language';

const entity = 'client';

const Labels = {
  PANEL_TITLE: lang.customer,
  DATATABLE_TITLE: lang.customer_list,
  ADD_NEW_ENTITY: lang.add_new_customer,
  ENTITY_NAME: lang.customer,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
