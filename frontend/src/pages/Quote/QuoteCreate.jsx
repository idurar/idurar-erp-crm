import useLanguage from '@/locale/useLanguage';
import CreateQuoteModule from '@/modules/QuoteModule/CreateQuoteModule';
import quoteConfig from './config';

export default function QuoteCreate() {
  const translate = useLanguage();
  return <CreateQuoteModule config={quoteConfig(translate)} />;
}
