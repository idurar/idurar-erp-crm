import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, Dropdown, Select } from 'antd';

import { languages } from '@/utils';

// import Notifications from '@/components/Notification';

import { AppstoreOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

import { selectLangCode } from '@/redux/translate/selectors';
import { checkImage } from '@/request';

import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { translateAction } from '@/redux/translate/actions';
import history from '@/utils/history';

import { BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/lang/useLanguage';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);

  const dispatch = useDispatch();
  const langCode = useSelector(selectLangCode);
  const translate = useLanguage();

  const srcImgProfile = checkImage(BASE_URL + currentAdmin?.photo)
    ? BASE_URL + currentAdmin?.photo
    : null;

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
    <div className="headerIcon" style={{ zIndex: '99' }}>
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
          dispatch(translateAction.translate('zh_cn'));
        }}
      />

      <Select
        showSearch
        placeholder={translate('select language')}
        defaultValue={langCode}
        style={{ marginTop: '15px', width: '120px', float: 'right' }}
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
        }
        onSelect={(value) => {
          dispatch(translateAction.translate(value));
        }}
      >
        {languages.map((language) => (
          <Select.Option
            key={language.value}
            value={language.value}
            label={language.label.toLowerCase()}
          >
            <div className="demo-option-label-item">
              <span role="img" aria-label={language.label}>
                {language.icon}
              </span>
              {language.label}
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
