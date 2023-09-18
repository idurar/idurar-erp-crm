import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import OfferForm from '@/modules/OfferModule/Forms/OfferForm';

export default function CreateOfferModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={OfferForm} />
    </ErpLayout>
  );
}
