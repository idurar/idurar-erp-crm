import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, Dropdown, Layout } from 'antd';

// import Notifications from '@/components/Notification';

import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';

import { checkImage } from '@/request';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { useNavigate } from 'react-router-dom';

import { BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';
import SelectLanguage from '@/components/SelectLanguage';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;

  const translate = useLanguage();

  const [hasPhotoprofile, setHasPhotoprofile] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await checkImage(BASE_URL + currentAdmin?.photo);
      setHasPhotoprofile(result);
    }
    fetchData();
    return () => {
      return false;
    };
  }, []);

  const srcImgProfile = hasPhotoprofile ? BASE_URL + currentAdmin?.photo : null;

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className="profileDropdown" onClick={() => navigate('/profile')}>
        <Avatar
          size="large"
          className="last"
          src={srcImgProfile}
          style={{ color: '#f56a00', backgroundColor: !hasPhotoprofile ? '#fde3cf' : '#f9fafc' }}
        >
          {currentAdmin?.name.charAt(0).toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <SettingOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'}>
          <DropdownMenu text={translate('profile_settings')} />
        </Link>
      ),
    },
    {
      icon: <SettingOutlined />,
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
    <Header
      style={{
        padding: '20px',
        background: '#f9fafc',
        display: ' flex',
        flexDirection: ' row-reverse',
        justifyContent: ' flex-start',
        gap: ' 15px',
      }}
    >
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        placement="bottomRight"
        stye={{ width: '280px', float: 'right' }}
      >
        {/* <Badge dot> */}
        <Avatar
          className="last"
          src={srcImgProfile}
          style={{
            color: '#f56a00',
            backgroundColor: !hasPhotoprofile ? '#fde3cf' : '#f9fafc',
            float: 'right',
          }}
          size="large"
        >
          {currentAdmin?.name.charAt(0).toUpperCase()}
        </Avatar>
        {/* </Badge> */}
      </Dropdown>

      {/* <Avatar
        icon={<AppstoreOutlined />}
        onClick={() => {
        
        }}
        style={{ float: 'right' }}
        size="large"
      /> */}

      <SelectLanguage />
    </Header>
  );
}
