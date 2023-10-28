import useLanguage from '@/lang/useLanguage';
import UpdateEmailModule from '@/modules/EmailModule/UpdateEmailModule';

export default function EmailUpdate() {
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

  return <UpdateEmailModule config={configPage} />;
}
