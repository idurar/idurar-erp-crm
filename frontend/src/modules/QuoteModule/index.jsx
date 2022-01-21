import { ErpLayout } from '@/layout';
import ErpPanel from '@/components/ErpPanel';
import QuoteForm from './QuoteForm';
import DataTableDropMenu from './DataTableDropMenu';

export default function InvoiceModule({ config }) {
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        CreateForm={QuoteForm}
        UpdateForm={QuoteForm}
        DataTableDropMenu={DataTableDropMenu}
      ></ErpPanel>
    </ErpLayout>
  );
}
