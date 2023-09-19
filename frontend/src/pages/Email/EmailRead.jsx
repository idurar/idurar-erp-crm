import configPage from './config';
import ReadEmailModule from '@/modules/EmailModule/ReadEmailModule';

export default function EmailRead() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <ReadEmailModule config={config} />;
}
