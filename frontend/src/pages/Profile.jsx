import React from 'react';
import ProfileModule from '@/modules/ProfileModule';

import lang from '@/lang/language';

export default function Profile() {
  const entity = 'profile';

  const Labels = {
    PANEL_TITLE: lang.profile,
    ENTITY_NAME: lang.profile,
    CREATE_ENTITY: lang.save,
    UPDATE_ENTITY: lang.update,
  };

  const config = {
    entity,
    ...Labels,
  };
  return <ProfileModule config={config} />;
}
