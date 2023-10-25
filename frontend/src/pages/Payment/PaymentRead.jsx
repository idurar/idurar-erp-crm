import configPage from './config';
import ReadPaymentModule from '@/modules/PaymentModule/ReadPaymentModule';

export default function PaymentRead() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <ReadPaymentModule config={config} />;
}
