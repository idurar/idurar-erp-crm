import { useState, useEffect } from 'react';
import { Menu, Tabs, Button, Divider } from 'antd';
import { SettingOutlined, FileTextOutlined, CreditCardOutlined } from '@ant-design/icons';
import { SettingsLayout } from '@/layout';

import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';

const menuItems = [
  { key: 'generalSettings', label: 'General Settings', icon: <SettingOutlined /> },
  { key: 'paymentSettings', label: 'Payment Settings', icon: <CreditCardOutlined /> },
  { key: 'invoiceSettings', label: 'Invoice Settings', icon: <FileTextOutlined /> },
];

const RightMenu = ({ activeTab, handleTabChange }) => {
  const menuList = menuItems.map((item, index) => (
    <Menu.Item key={item.key} icon={item.icon} onClick={() => handleTabChange(item.key)}>
      {item.label}
    </Menu.Item>
  ));
  return (
    <div className="pad20" style={{ width: '100%' }}>
      <Menu mode={'vertical'} selectedKeys={[activeTab]} style={{ width: '100%' }}>
        {menuList}
      </Menu>
    </div>
  );
};

const Visibility = ({ isVisible = false, children }) => {
  const show = isVisible ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return <div style={show}>{children}</div>;
};

export default function Settings() {
  const [tabKey, setTabKey] = useState(menuItems[0].key);
  const [tabTitle, setTabTitle] = useState(menuItems[0].label);

  const isActive = (tab) => {
    return tabKey === tab ? true : false;
  };

  const handleTabChange = (tab) => {
    const menuItem = menuItems.find((item) => item.key === tab);
    setTabTitle(menuItem.label);
    setTabKey(tab);
  };

  return (
    <SettingsLayout
      topCardContent={tabTitle}
      topCardTitle={'Settings'}
      bottomCardContent={<RightMenu activeTab={tabKey} handleTabChange={handleTabChange} />}
    >
      <Visibility isVisible={isActive(menuItems[0].key)}>
        <GeneralSettings />
      </Visibility>
      <Visibility isVisible={isActive(menuItems[1].key)}>
        <PaymentSettings />
      </Visibility>
      <Visibility isVisible={isActive(menuItems[2].key)}>
        <InvoiceSettings />
      </Visibility>
    </SettingsLayout>
  );
}
