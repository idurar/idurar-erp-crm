import configPage from './config';
import RecordPaymentModule from '@/modules/InvoiceModule/RecordPaymentModule';

export default function InvoiceRecord() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <RecordPaymentModule config={config} />;
}
