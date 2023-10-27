import lang from '@/lang/language';
const entity = 'invoice';
const Labels = {
  PANEL_TITLE: lang.invoice,
  DATATABLE_TITLE: lang.invoice_list,
  ADD_NEW_ENTITY: lang.add_new_invoice,
  ENTITY_NAME: lang.invoice,
  CREATE_ENTITY: lang.save,
  UPDATE_ENTITY: lang.update,
  RECORD_ENTITY: lang.record_payment,
};

const configPage = {
  entity,
  ...Labels,
};

export default configPage;
