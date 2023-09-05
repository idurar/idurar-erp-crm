import configPage from './config';
import RecordInvoiceModule from '@/modules/InvoiceModule/RecordInvoiceModule';

export default function InvoiceRecord() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <RecordInvoiceModule config={config} />;
}
