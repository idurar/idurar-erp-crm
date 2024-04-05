import useLanguage from '@/locale/useLanguage';
import ReadQuoteModule from '@/modules/QuoteModule/ReadQuoteModule';

export default function QuoteRead() {
  const translate = useLanguage();

  const entity = 'quote';

  const Labels = {
    PANEL_TITLE: translate('quote'),
    DATATABLE_TITLE: translate('quote_list'),
    ADD_NEW_ENTITY: translate('add_new_quote'),
    ENTITY_NAME: translate('quote'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <ReadQuoteModule config={configPage} />;
}
