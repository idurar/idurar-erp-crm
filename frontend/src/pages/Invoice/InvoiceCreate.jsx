import { ErpLayout } from '@/layout';
import CreateItem from '@/components/ErpPanel/CreateItem';
import InvoiceForm from '@/modules/InvoiceModule/InvoiceForm';

export default function InvoiceCreate() {
  const PANEL_TITLE = 'invoice';
  const dataTableTitle = 'Invoices Lists';
  const ADD_NEW_ENTITY = 'Add new invoice';
  const DATATABLE_TITLE = 'Invoices List';
  const ENTITY_NAME = 'invoice';
  const CREATE_ENTITY = 'Save invoice';
  const UPDATE_ENTITY = 'Update invoice';

  const config = {
    entity: 'Invoice',
    PANEL_TITLE,
    dataTableTitle,
    ENTITY_NAME,
    CREATE_ENTITY,
    ADD_NEW_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    // dataTableColumns,
    // searchConfig,
    // entityDisplayLabels,
  };

  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={InvoiceForm} />
    </ErpLayout>
  );
}
