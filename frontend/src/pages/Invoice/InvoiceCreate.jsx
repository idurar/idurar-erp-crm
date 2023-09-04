import configPage from './config';
import CreateInvoiceModule from '@/modules/InvoiceModule/CreateInvoiceModule';

const customConfig = {
  /*your custom config*/
};
const config = {
  ...configPage,
  //customConfig,
};

export default function InvoiceCreate() {
  return <CreateInvoiceModule config={config} />;
}
