import configPage from './config';
import CreateLeadModule from '@/modules/LeadModule/CreateLeadModule';

const config = {
  ...configPage,
  //customConfig,
};

export default function LeadCreate() {
  return <CreateLeadModule config={config} />;
}
