import configPage from './config';
import UpdateInvoiceModule from '@/modules/InvoiceModule/UpdateInvoiceModule';

export default function InvoiceUpdate() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <UpdateInvoiceModule config={config} />;
}
