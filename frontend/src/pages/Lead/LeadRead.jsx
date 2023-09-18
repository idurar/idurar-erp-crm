import configPage from './config';
import ReadLeadModule from '@/modules/LeadModule/ReadLeadModule';

export default function LeadRead() {
  const config = {
    ...configPage,
    //customConfig,
  };
  return <ReadLeadModule config={config} />;
}
