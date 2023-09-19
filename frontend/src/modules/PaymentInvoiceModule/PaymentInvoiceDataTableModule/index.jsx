import { ErpLayout } from '@/layout';
import PaymentInvoiceERP from './components/PaymentInvoiceERP';
import DataTableDropMenu from './components/DataTableDropMenu';

export default function PaymentInvoiceDataTableModule({ config }) {
  return (
    <ErpLayout>
      <PaymentInvoiceERP config={config} DataTableDropMenu={DataTableDropMenu}></PaymentInvoiceERP>
    </ErpLayout>
  );
}
