import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import PaymentInvoiceForm from '@/modules/PaymentInvoiceModule/Forms/PaymentInvoiceForm';

export default function CreatePaymentInvoiceModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={PaymentInvoiceForm} />
    </ErpLayout>
  );
}
