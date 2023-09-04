import configPage from './config';
import ReadPaymentInvoiceModule from '@/modules/PaymentInvoiceModule/ReadPaymentInvoiceModule';

export default function PaymentInvoiceRead() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <ReadPaymentInvoiceModule config={config} />;
}
