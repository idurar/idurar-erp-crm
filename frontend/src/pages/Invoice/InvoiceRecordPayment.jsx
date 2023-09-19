import configPage from './config';
import RecordPaymentInvoiceModule from '@/modules/InvoiceModule/RecordPaymentInvoiceModule';

export default function InvoiceRecord() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <RecordPaymentInvoiceModule config={config} />;
}
