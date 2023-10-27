import lang from '@/lang/language';

const entity = 'currency';

const Labels = {
  PANEL_TITLE: lang.currency,
  DATATABLE_TITLE: lang.currency_list,
  ADD_NEW_ENTITY: lang.add_new_currency,
  ENTITY_NAME: lang.currency,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
