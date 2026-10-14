import useLanguage from '@/locale/useLanguage';
import ReadQuoteModule from '@/modules/QuoteModule/ReadQuoteModule';
import quoteConfig from './config';

export default function QuoteRead() {
  const translate = useLanguage();
  return <ReadQuoteModule config={quoteConfig(translate)} />;
}
