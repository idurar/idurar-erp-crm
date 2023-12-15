import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Popover, Button, Badge } from 'antd';

// import Notifications from '@/components/Notification';

import { SettingOutlined, LogoutOutlined, RocketOutlined } from '@ant-design/icons';

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
      if (currentAdmin?.photo) {
        const result = await checkImage(BASE_URL + currentAdmin?.photo);
        setHasPhotoprofile(result);
      }
    }
    fetchData();
    return () => {
      return false;
    };
  }, []);

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className="profileDropdown" onClick={() => navigate('/profile')}>
        <Avatar
          size="large"
          className="last"
          src={hasPhotoprofile ? BASE_URL + currentAdmin?.photo : null}
          style={{ color: '#f56a00', backgroundColor: !hasPhotoprofile ? '#fde3cf' : '#f9fafc' }}
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
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const content = () => {
    return (
      <div className="pad10">
        <p style={{ fontSize: 12 }}>{translate('Upgrade for one time lifetime plan')}</p>
        <p style={{ fontSize: 12 }}>{translate('Plus 1 year free update')}</p>
        <p style={{ fontSize: 14, fontWeight: 900 }}>{translate('Price')} : $ 590</p>
        <p style={{ fontSize: 12 }}>
          {translate('Cancel any time while keep using IDURAR for free for ever')}
        </p>
        <Button
          type="primary"
          onClick={() => {
            window.open(`https://www.idurarapp.com/purchase-license/`);
          }}
        >
          {translate('purchase now')}
        </Button>
      </div>
    );
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
          src={hasPhotoprofile ? BASE_URL + currentAdmin?.photo : null}
          style={{
            color: '#f56a00',
            backgroundColor: !hasPhotoprofile ? '#fde3cf' : '#f9fafc',
            float: 'right',
            cursor: 'pointer',
          }}
          size="large"
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        {/* </Badge> */}
      </Dropdown>

      <Popover content={content} title={translate('Upgrade Now')} trigger="click">
        <Badge count={1} size="small">
          <Avatar
            icon={<RocketOutlined />}
            style={{
              color: '#f56a00',
              backgroundColor: '#FFF',
              float: 'right',
              marginTop: '5px',
              cursor: 'pointer',
            }}
          />
        </Badge>
      </Popover>
      <SelectLanguage />
    </Header>
  );
}

//  console.log(
//    '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
//  );
