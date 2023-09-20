import configPage from './config';
import UpdateEmailModule from '@/modules/EmailModule/UpdateEmailModule';

export default function EmailUpdate() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <UpdateEmailModule config={config} />;
}
