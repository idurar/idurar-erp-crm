import configPage from './config';
import UpdateQuoteModule from '@/modules/QuoteModule/UpdateQuoteModule';

export default function QuoteUpdate() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <UpdateQuoteModule config={config} />;
}
