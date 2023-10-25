import configPage from './config';
import UpdatePaymentModule from '@/modules/PaymentModule/UpdatePaymentModule';

export default function PaymentUpdate() {
  const config = {
    ...configPage,
  };
  return <UpdatePaymentModule config={config} />;
}
