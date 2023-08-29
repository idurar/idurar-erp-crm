import { useState, useEffect } from 'react';
import { Menu, Tabs, Button, Divider } from 'antd';
import { SettingsLayout } from '@/layout';

import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';

const RightMenu = ({ activeTab, handleTabChange }) => {
  const menuItems = [
    { key: 'generalSettings', label: 'General Settings' },
    { key: 'paymentSettings', label: 'Payment Settings' },
    { key: 'invoiceSettings', label: 'Invoice Settings' },
  ];
  const menuList = menuItems.map((item, index) => (
    <Button
      type={item.key == activeTab ? 'default' : 'text'}
      key={item.key}
      style={{ marginBottom: '10px' }}
      block
      onClick={() => handleTabChange(item.key)}
    >
      {item.label}
    </Button>
  ));
  return <div className="pad10">{menuList}</div>;
};

const Visibility = ({ isVisible = false, children }) => {
  const show = isVisible ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return <div style={show}>{children}</div>;
};

export default function Settings() {
  const [tabTitle, setTabTitle] = useState('generalSettings');

  const isActive = (tab) => {
    return tabTitle === tab ? true : false;
  };

  const handleTabChange = (tab) => {
    setTabTitle(tab);
  };

  return (
    <SettingsLayout
      topCardContent={tabTitle}
      topCardTitle={'Settings'}
      bottomCardContent={<RightMenu activeTab={tabTitle} handleTabChange={handleTabChange} />}
    >
      <Visibility isVisible={isActive('generalSettings')}>
        <GeneralSettings />
      </Visibility>
      <Visibility isVisible={isActive('paymentSettings')}>
        <PaymentSettings />
      </Visibility>
      <Visibility isVisible={isActive('invoiceSettings')}>
        <InvoiceSettings />
      </Visibility>
    </SettingsLayout>
  );
}
