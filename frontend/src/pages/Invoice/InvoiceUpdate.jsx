import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
import UpdateInvoiceModule from '@/modules/InvoiceModule/UpdateInvoiceModule';

export default function InvoiceUpdate() {
  const entity = 'invoice';
  const lang = useSelector(selectCurrentLang);
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
  return <UpdateInvoiceModule config={configPage} />;
}
