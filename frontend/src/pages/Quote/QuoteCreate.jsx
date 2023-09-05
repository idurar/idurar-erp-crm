import configPage from './config';
import CreateQuoteModule from '@/modules/QuoteModule/CreateQuoteModule';

const customConfig = {
  /*your custom config*/
};
const config = {
  ...configPage,
  //customConfig,
};

export default function QuoteCreate() {
  return <CreateQuoteModule config={config} />;
}
