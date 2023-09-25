import React, { useLayoutEffect } from 'react';

import { useProfileContext } from '@/context/profileContext';
import AdminInfo from './AdminInfo';
import UpdateAdmin from './UpdateAdmin';
import PasswordModal from './PasswordModal';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { crud } from '@/redux/crud/actions';

const Visibility = ({ isVisible, children }) => {
  const show = isVisible ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return <div style={show}>{children}</div>;
};

export default function Profile({ config }) {
  const { state } = useProfileContext();
  const { update, read, passwordModal } = state;
  const { id } = useSelector(selectAuth);
  // using the crud redux to fetch and update the admin
  const entity = 'admin';
  const dispatch = useDispatch();
  dispatch(crud.read({ entity, id }));
  config = { ...config, id };

  return (
    <>
      <Visibility isVisible={read.isOpen}>
        <AdminInfo config={config} />
      </Visibility>
      <Visibility isVisible={update.isOpen}>
        <UpdateAdmin config={config} />
      </Visibility>
      <PasswordModal config={config} isVisible={passwordModal.isOpen} />
    </>
  );
}
