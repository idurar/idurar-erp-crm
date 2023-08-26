import { ErpLayout } from '@/layout';
import ErpPanel from '@/components/ErpPanel';
import PaymentInvoiceForm from '@/forms/PaymentInvoiceForm';
import DataTableDropMenu from './DataTableDropMenu';

export default function PaymentModule({ config }) {
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        CreateForm={PaymentInvoiceForm}
        UpdateForm={PaymentInvoiceForm}
        DataTableDropMenu={DataTableDropMenu}
      ></ErpPanel>
    </ErpLayout>
  );
}
