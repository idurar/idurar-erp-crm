import { ProfileContextProvider } from '@/context/profileContext';
const ProfileLayout = ({ children }) => {
  return <ProfileContextProvider>{children}</ProfileContextProvider>;
};

export default ProfileLayout;
