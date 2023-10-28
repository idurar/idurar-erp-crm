import useLanguage from '@/lang/useLanguage';
import ReadEmailModule from '@/modules/EmailModule/ReadEmailModule';

export default function EmailRead() {
  const entity = 'email';
  const getLang = useLanguage();

  const Labels = {
    PANEL_TITLE: getLang('email_template'),
    DATATABLE_TITLE: getLang('email_template_list'),
    ADD_NEW_ENTITY: getLang('add_new_email_template'),
    ENTITY_NAME: getLang('email_template'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
  };

  const configPage = {
    entity,
    create: false,
    ...Labels,
  };
  return <ReadEmailModule config={configPage} />;
}
