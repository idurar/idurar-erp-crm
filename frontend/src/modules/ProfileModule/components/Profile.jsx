import { useProfileContext } from '@/context/profileContext';
import AdminInfo from './AdminInfo';
import UpdateAdmin from './UpdateAdmin';
import PasswordModal from './PasswordModal';

const Visibility = ({ isOpen, children }) => {
  const show = isOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return <div style={show}>{children}</div>;
};

export default function Profile({ config }) {
  const { state } = useProfileContext();
  const { update, read } = state;

  return (
    <div>
      <Visibility isOpen={read.isOpen}>
        <AdminInfo config={config} />
      </Visibility>
      <Visibility isOpen={update.isOpen}>
        <UpdateAdmin config={config} />
      </Visibility>
      <PasswordModal />
    </div>
  );
}
