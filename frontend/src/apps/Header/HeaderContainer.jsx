import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout } from 'antd';
import { LogoutOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { FILE_BASE_URL } from '@/config/serverApiConfig';
import useLanguage from '@/locale/useLanguage';
import UpgradeButton from './UpgradeButton';

export default function HeaderContent() {
  const { Header } = Layout;
  const navigate = useNavigate();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const translate = useLanguage();

  // --- Subcomponent: Profile Section inside Dropdown ---
  const ProfileDropdown = () => (
    <div className="profileDropdown" onClick={() => navigate('/profile')}>
      <Avatar
        size="large"
        src={currentAdmin?.photo ? `${FILE_BASE_URL}${currentAdmin.photo}` : undefined}
        style={{
          color: '#f56a00',
          backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf',
          boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 6px 1px',
          cursor: 'pointer',
        }}
      >
        {currentAdmin?.name?.charAt(0)?.toUpperCase()}
      </Avatar>

      <div className="profileDropdownInfo">
        <p>
          {currentAdmin?.name} {currentAdmin?.surname}
        </p>
        <p>{currentAdmin?.email}</p>
      </div>
    </div>
  );

  // --- Dropdown Menu Items ---
  const menuItems = [
    {
      label: <ProfileDropdown />,
      key: 'profileDropdown',
    },
    { type: 'divider' },
    {
      icon: <UserOutlined />,
      key: 'profileSettings',
      label: (
        <Link to="/profile">
          {translate('profile_settings')}
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: 'appSettings',
      label: (
        <Link to="/settings">
          {translate('app_settings')}
        </Link>
      ),
    },
    { type: 'divider' },
    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: (
        <Link to="/logout">
          {translate('logout')}
        </Link>
      ),
    },
  ];

  return (
    <Header
      style={{
        padding: '20px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        gap: '15px',
      }}
    >
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Avatar
          size="large"
          src={currentAdmin?.photo ? `${FILE_BASE_URL}${currentAdmin.photo}` : undefined}
          style={{
            color: '#f56a00',
            backgroundColor: currentAdmin?.photo ? 'none' : '#fde3cf',
            boxShadow: 'rgba(150, 190, 238, 0.35) 0px 0px 10px 2px',
            cursor: 'pointer',
          }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      </Dropdown>

      <UpgradeButton />
    </Header>
  );
}
