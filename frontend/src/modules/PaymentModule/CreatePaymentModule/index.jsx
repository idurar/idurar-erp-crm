import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import PaymentForm from '@/modules/PaymentModule/Forms/PaymentForm';

export default function CreatePaymentModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={PaymentForm} />
    </ErpLayout>
  );
}
