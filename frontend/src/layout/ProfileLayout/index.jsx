import { ProfileContextProvider } from '@/context/profileContext';
import React from 'react';

const ProfileLayout = ({ children }) => {
  return <ProfileContextProvider>{children}</ProfileContextProvider>;
};

export default ProfileLayout;
