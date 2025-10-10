import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Badge, Button, Switch } from 'antd';
import styles from './HeaderContent.module.css';

// import Notifications from '@/components/Notification';

import { LogoutOutlined, ToolOutlined, UserOutlined, BulbOutlined } from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { FILE_BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';

import UpgradeButton from './UpgradeButton';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;

  const translate = useLanguage();

  // Example toggle handler - you can customize this based on your needs
  const handleToggle = (checked) => {
    console.log('Toggle switched:', checked);
    // Add your toggle logic here (theme switch, feature toggle, etc.)
  };

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className={styles.profileDropdown} onClick={() => navigate('/profile')}>
        <Avatar
          size="large"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          className={styles.avatar}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <div className={styles.profileDropdownInfo}>
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ text }) => {
    return <span>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'}>
          <DropdownMenu text={translate('profile_settings')} />
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
    },
    {
      type: 'divider',
    },
    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to={'/logout'}>{translate('logout')}</Link>,
    },
  ];

  return (
    <Header className={styles.header}>
      {/* Toggle Button */}
      <div className={styles.toggleContainer}>
        <BulbOutlined className={styles.toggleIcon} />
        <span className={styles.toggleLabel}>Dark Mode</span>
        <Switch 
          size="small"
          onChange={handleToggle}
          defaultChecked={false}
          className={styles.toggleSwitch}
        />
      </div>

      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        placement="bottomRight"
        className={styles.dropdown}
      >
        <Avatar
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          className={styles.avatar}
          size="large"
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      </Dropdown>

      {/* <AppsButton /> */}

      <UpgradeButton />
    </Header>
  );
}

//  console.log(
//    '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
//  );