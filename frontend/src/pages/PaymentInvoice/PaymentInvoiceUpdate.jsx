import configPage from './config';
import UpdatePaymentInvoiceModule from '@/modules/PaymentInvoiceModule/UpdatePaymentInvoiceModule';

export default function PaymentInvoiceUpdate() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <UpdatePaymentInvoiceModule config={config} />;
}
