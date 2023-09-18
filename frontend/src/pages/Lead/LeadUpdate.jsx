import configPage from './config';
import UpdateLeadModule from '@/modules/LeadModule/UpdateLeadModule';

export default function LeadUpdate() {
  const config = {
    ...configPage,
    //customConfig,
  };
  return <UpdateLeadModule config={config} />;
}
