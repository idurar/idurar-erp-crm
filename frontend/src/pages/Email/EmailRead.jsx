import useLanguage from '@/locale/useLanguage';
import ReadEmailModule from '@/modules/EmailModule/ReadEmailModule';

export default function EmailRead() {
  const entity = 'email';
  const translate = useLanguage();

  const Labels = {
    PANEL_TITLE: translate('email_template'),
    DATATABLE_TITLE: translate('email_template_list'),
    ADD_NEW_ENTITY: translate('add_new_email_template'),
    ENTITY_NAME: translate('email_template'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };

  const configPage = {
    entity,
    create: false,
    ...Labels,
  };
  return <ReadEmailModule config={configPage} />;
}
