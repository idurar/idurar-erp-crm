import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
import CreateQuoteModule from '@/modules/QuoteModule/CreateQuoteModule';

export default function QuoteCreate() {
  const lang = useSelector(selectCurrentLang);

  const entity = 'quote';

  const Labels = {
    PANEL_TITLE: lang.quote,
    DATATABLE_TITLE: lang.quote_list,
    ADD_NEW_ENTITY: lang.add_new_quote,
    ENTITY_NAME: lang.quote,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <CreateQuoteModule config={configPage} />;
}
