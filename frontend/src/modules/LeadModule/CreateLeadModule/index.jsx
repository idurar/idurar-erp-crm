import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import LeadForm from '@/modules/LeadModule/Forms/LeadForm';

export default function CreateLeadModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={LeadForm} />
    </ErpLayout>
  );
}
