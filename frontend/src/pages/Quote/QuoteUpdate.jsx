import useLanguage from '@/locale/useLanguage';
import UpdateQuoteModule from '@/modules/QuoteModule/UpdateQuoteModule';
import quoteConfig from './config';

export default function QuoteUpdate() {
  const translate = useLanguage();
  return <UpdateQuoteModule config={quoteConfig(translate)} />;
}
