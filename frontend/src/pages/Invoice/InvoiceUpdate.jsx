import useLanguage from '@/locale/useLanguage';
import UpdateInvoiceModule from '@/modules/InvoiceModule/UpdateInvoiceModule';

export default function InvoiceUpdate() {
  const entity = 'invoice';
  const translate = useLanguage();
  const Labels = {
    PANEL_TITLE: translate('invoice'),
    DATATABLE_TITLE: translate('invoice_list'),
    ADD_NEW_ENTITY: translate('add_new_invoice'),
    ENTITY_NAME: translate('invoice'),

    RECORD_ENTITY: translate('record_payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <UpdateInvoiceModule config={configPage} />;
}
