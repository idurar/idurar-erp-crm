import configPage from './config';
import ReadQuoteModule from '@/modules/QuoteModule/ReadQuoteModule';

export default function QuoteRead() {
  const customConfig = {
    /*your custom config*/
  };
  const config = {
    ...configPage,
    //customConfig,
  };
  return <ReadQuoteModule config={config} />;
}
