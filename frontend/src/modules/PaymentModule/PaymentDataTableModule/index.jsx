import { ErpLayout } from '@/layout';
import PaymentERP from './components/PaymentERP';
import DataTableDropMenu from './components/DataTableDropMenu';

export default function PaymentDataTableModule({ config }) {
  return (
    <ErpLayout>
      <PaymentERP config={config} DataTableDropMenu={DataTableDropMenu}></PaymentERP>
    </ErpLayout>
  );
}
