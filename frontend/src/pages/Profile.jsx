import React from 'react';
import ProfileModule from '@/modules/ProfileModule';

import useLanguage from '@/lang/useLanguage';

export default function Profile() {
  const entity = 'profile';
  const getLang = useLanguage();

  const Labels = {
    PANEL_TITLE: getLang('profile'),
    ENTITY_NAME: getLang('profile'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
  };

  const config = {
    entity,
    ...Labels,
  };
  return <ProfileModule config={config} />;
}
