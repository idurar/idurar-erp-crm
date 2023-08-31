import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';
import InvoiceForm from '@/modules/InvoiceModule/Forms/InvoiceForm';
import DataTableDropMenu from './components/DataTableDropMenu';

export default function InvoiceDataTableModule({ config }) {
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
