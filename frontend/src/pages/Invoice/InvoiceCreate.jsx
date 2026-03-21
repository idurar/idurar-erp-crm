import useLanguage from '@/locale/useLanguage';
import CreateInvoiceModule from '@/modules/InvoiceModule/CreateInvoiceModule';

export default function InvoiceCreate() {
  const translate = useLanguage();
  const entity = 'invoice';

  const labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    ENTITY_NAME: translate('invoice'),
    RECORD_ENTITY: translate('record_payment'),
  };

  const configPage = {
    entity,
    ...labels,
  };

  return <CreateInvoiceModule config={configPage} />;
}
