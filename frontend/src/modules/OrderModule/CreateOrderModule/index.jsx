import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/AdvancedCrudModule/CreateItem';
import OrderForm from '@/modules/OrderModule/Forms/OrderForm';

export default function CreateInvoiceModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={OrderForm} />
    </ErpLayout>
  );
}
