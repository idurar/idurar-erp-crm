import React from 'react';
import ProfileModule from '@/modules/ProfileModule';

export default function Invoice() {
  const entity = 'invoice';

  const PANEL_TITLE = 'profile';
  const ENTITY_NAME = 'profile';
  const UPDATE_ENTITY = 'Update profile';

  const config = {
    entity,
    PANEL_TITLE,
    ENTITY_NAME,
    UPDATE_ENTITY,
  };
  return <ProfileModule config={config} />;
}
