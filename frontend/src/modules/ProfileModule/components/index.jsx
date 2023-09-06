import React, { useLayoutEffect } from 'react';

import { useProfileContext } from '@/context/profileContext';
import ProfileInfo from './AdminInfo';
import UpdateProfile from './UpdateAdmin';
import PasswordModal from './PasswordModal';

const Visibility = ({ isVisible, children }) => {
  const show = isVisible ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return <div style={show}>{children}</div>;
};

export default function Profile({ config }) {
  const { state } = useProfileContext();
  const { update, read, passwordModal } = state;

  return (
    <>
      <Visibility isVisible={read.isOpen}>
        <ProfileInfo config={config} />
      </Visibility>
      <Visibility isVisible={update.isOpen}>
        <UpdateProfile config={config} />
      </Visibility>
      <PasswordModal config={config} isVisible={passwordModal.isOpen} />
    </>
  );
}
