import { ErpLayout } from '@/layout';
import CreateItem from '@/components/ErpPanel/CreateItem';
import QuoteForm from '@/modules/QuoteModule/QuoteForm';

export default function InvoiceCreate() {
  const PANEL_TITLE = 'quote';
  const dataTableTitle = 'quotes Lists';
  const ADD_NEW_ENTITY = 'Add new quote';
  const DATATABLE_TITLE = 'quotes List';
  const ENTITY_NAME = 'quote';
  const CREATE_ENTITY = 'Save quote';
  const UPDATE_ENTITY = 'Update quote';

  const config = {
    entity: 'Quote',
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
      <CreateItem config={config} CreateForm={QuoteForm} />
    </ErpLayout>
  );
}
