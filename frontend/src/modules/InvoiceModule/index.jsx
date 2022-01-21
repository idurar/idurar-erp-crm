import { ErpLayout } from '@/layout';
import ErpPanel from '@/components/ErpPanel';
import InvoiceForm from './InvoiceForm';
import DataTableDropMenu from './DataTableDropMenu';

export default function InvoiceModule({ config }) {
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        CreateForm={InvoiceForm}
        UpdateForm={InvoiceForm}
        DataTableDropMenu={DataTableDropMenu}
      ></ErpPanel>
    </ErpLayout>
  );
}
