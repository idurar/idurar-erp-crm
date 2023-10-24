import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Avatar, Menu, Dropdown } from 'antd';
import Notifications from '@/components/Notification';

import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import photo from '@/style/images/photo.png';

import { selectCurrentAdmin } from '@/redux/auth/selectors';
import history from '@/utils/history';
import uniqueId from '@/utils/uinqueId';

import { BASE_URL } from '@/config/serverApiConfig';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  console.log('🚀 ~ file: index.jsx:23 ~ HeaderContent ~ currentAdmin:', currentAdmin);

  const { SubMenu } = Menu;

  const srcImgProfile = currentAdmin?.photo ? (
    BASE_URL + currentAdmin?.photo
  ) : (
    <UserOutlined style={{ color: '#333', fontSize: 'inherit' }} />
  );

  const profileDropdown = (
    <div className="profileDropdown whiteBox shadow" style={{ minWidth: '200px' }}>
      <div className="pad15" onClick={() => history.push('/profile')} style={{ cursor: 'pointer' }}>
        <Avatar
          size="large"
          className="last"
          src={srcImgProfile}
          style={{ float: 'left', fontSize: '32px' }}
        />
        <div className="info">
          <p className="strong">
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
      <div className="line"></div>

      <div>
        <Menu>
          <Menu.Item
            icon={<SettingOutlined />}
            key={`${uniqueId()}`}
            onClick={() => history.push('/profile')}
          >
            Profil Settings
          </Menu.Item>
          <Menu.Item
            icon={<SettingOutlined />}
            key={`${uniqueId()}`}
            onClick={() => history.push('/settings/')}
          >
            App Settings
          </Menu.Item>
        </Menu>
      </div>
      <div className="line"></div>
      <div>
        <Menu>
          <Menu.Item
            icon={<LogoutOutlined />}
            key={`${uniqueId()}`}
            onClick={() => history.push('/logout')}
          >
            logout
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <div className="headerIcon" style={{ position: 'absolute', right: 0, zIndex: '99' }}>
      <Dropdown overlay={profileDropdown} trigger={['click']} placement="bottomRight">
        {/* <Badge dot> */}
        <Avatar className="last" src={srcImgProfile} />
        {/* </Badge> */}
      </Dropdown>

      <Avatar icon={<AppstoreOutlined />} />

      <Dropdown overlay={<Notifications />} trigger={['click']} placement="bottomRight">
        {/* <Badge dot> */}
        <Avatar icon={<BellOutlined />} />

        {/* </Badge> */}
      </Dropdown>
    </div>
  );
}
