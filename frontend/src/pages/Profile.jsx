import React from 'react';
import ProfileModule from '@/modules/ProfileModule';

export default function Profile() {
  const entity = 'profile';

  const PANEL_TITLE = 'profile';
  const ENTITY_NAME = 'Profile';
  const UPDATE_ENTITY = 'Update profile';

  const config = {
    entity,
    PANEL_TITLE,
    ENTITY_NAME,
    UPDATE_ENTITY,
  };
  return <ProfileModule config={config} />;
}
