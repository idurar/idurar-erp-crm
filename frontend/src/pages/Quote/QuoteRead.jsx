import useLanguage from '@/lang/useLanguage';
import ReadQuoteModule from '@/modules/QuoteModule/ReadQuoteModule';

export default function QuoteRead() {
  const getLang = useLanguage();

  const entity = 'quote';

  const Labels = {
    PANEL_TITLE: getLang('quote'),
    DATATABLE_TITLE: getLang('quote_list'),
    ADD_NEW_ENTITY: getLang('add_new_quote'),
    ENTITY_NAME: getLang('quote'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <ReadQuoteModule config={configPage} />;
}
