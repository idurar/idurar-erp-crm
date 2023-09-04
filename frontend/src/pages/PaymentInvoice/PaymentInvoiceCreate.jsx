import configPage from './config';
import CreatePaymentInvoiceModule from '@/modules/PaymentInvoiceModule/CreatePaymentInvoiceModule';

const customConfig = {
  /*your custom config*/
};
const config = {
  ...configPage,
  //customConfig,
};

export default function PaymentInvoiceCreate() {
  return <CreatePaymentInvoiceModule config={config} />;
}
