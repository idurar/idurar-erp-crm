import useLanguage from '@/lang/useLanguage';
import CreateInvoiceModule from '@/modules/InvoiceModule/CreateInvoiceModule';

export default function InvoiceCreate() {
  const entity = 'invoice';
  const getLang = useLanguage();
  const Labels = {
    PANEL_TITLE: getLang('invoice'),
    DATATABLE_TITLE: getLang('invoice_list'),
    ADD_NEW_ENTITY: getLang('add_new_invoice'),
    ENTITY_NAME: getLang('invoice'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
    RECORD_ENTITY: getLang('record_payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <CreateInvoiceModule config={configPage} />;
}
