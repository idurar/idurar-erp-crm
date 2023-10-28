import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, Menu, Dropdown } from 'antd';
// import Notifications from '@/components/Notification';

import { AppstoreOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import photo from '@/style/images/photo.png';
import { checkImage } from '@/request';

import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { langAction } from '@/redux/lang/actions';
import history from '@/utils/history';
import uniqueId from '@/utils/uinqueId';

import { BASE_URL } from '@/config/serverApiConfig';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const dispatch = useDispatch();

  const srcImgProfile = checkImage(BASE_URL + currentAdmin?.photo)
    ? BASE_URL + currentAdmin?.photo
    : photo;

  const ProfileDropdown = () => {
    return (
      <div className="profileDropdown" onClick={() => history.push('/profile')}>
        <Avatar
          size="large"
          className="last"
          src={srcImgProfile}
          style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
        >
          {currentAdmin?.name.charAt(0).toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p className="strong">
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
          <DropdownMenu text={'profile Settings'} />
        </Link>
      ),
    },
    {
      icon: <SettingOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>App Settings</Link>,
    },

    {
      type: 'divider',
    },

    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to={'/logout'}>Logout</Link>,
    },
  ];
  return (
    <div className="headerIcon" style={{ position: 'absolute', right: 0, zIndex: '99' }}>
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        placement="bottomRight"
        stye={{ width: '280px' }}
      >
        {/* <Badge dot> */}
        <Avatar
          className="last"
          src={srcImgProfile}
          style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
        >
          {currentAdmin?.name.charAt(0).toUpperCase()}
        </Avatar>
        {/* </Badge> */}
      </Dropdown>

      <Avatar
        icon={<AppstoreOutlined />}
        onClick={() => {
          dispatch(langAction.translate());
        }}
      />

      {/* <Dropdown overlay={<Notifications />} trigger={['click']} placement="bottomRight">
        <Avatar icon={<BellOutlined />} />
      </Dropdown> */}
    </div>
  );
}
