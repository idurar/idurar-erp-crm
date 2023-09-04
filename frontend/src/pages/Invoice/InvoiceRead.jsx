import configPage from './config';
import ReadInvoiceModule from '@/modules/InvoiceModule/ReadInvoiceModule';

export default function InvoiceRead() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <ReadInvoiceModule config={config} />;
}
