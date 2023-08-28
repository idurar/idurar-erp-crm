import { ErpLayout } from '@/layout';
import ErpPanel from '@/components/ErpPanel';
import PaymentInvoiceForm from '@/forms/PaymentInvoiceForm';
import DataTableDropMenu from './DataTableDropMenu';
import PaymentInvoiceItem from './PaymentInvoiceItem';

export default function PaymentModule({ config }) {
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        CreateForm={PaymentInvoiceForm}
        UpdateForm={PaymentInvoiceForm}
        DetailForm={PaymentInvoiceItem}
        DataTableDropMenu={DataTableDropMenu}
      ></ErpPanel>
    </ErpLayout>
  );
}
