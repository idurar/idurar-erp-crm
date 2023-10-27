import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
import ReadEmailModule from '@/modules/EmailModule/ReadEmailModule';

export default function EmailRead() {
  const entity = 'email';
  const lang = useSelector(selectCurrentLang);

  const Labels = {
    PANEL_TITLE: lang.email_template,
    DATATABLE_TITLE: lang.email_template_list,
    ADD_NEW_ENTITY: lang.add_new_email_template,
    ENTITY_NAME: lang.email_template,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
  };

  const configPage = {
    entity,
    create: false,
    ...Labels,
  };
  return <ReadEmailModule config={configPage} />;
}
