import { useState, useEffect } from 'react';
import { Menu, Tabs, Button, Divider } from 'antd';
import { SettingsLayout } from '@/layout';

import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';

const RightMenu = ({ activeTab, handleTabChange }) => {
  const menuItems = [
    { key: 'generalSettings', label: 'generalSettings' },
    { key: 'paymentSettings', label: 'paymentSettings' },
    { key: 'invoiceSettings', label: 'invoiceSettings' },
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
  const [state, setState] = useState('generalSettings');

  const isActive = (tab) => {
    return state === tab ? true : false;
  };

  const handleTabChange = (tab) => {
    setState(tab);
  };

  return (
    <SettingsLayout
      topCardContent="Generals Settings"
      topCardTitle="Settings"
      bottomCardContent={<RightMenu activeTab={state} handleTabChange={handleTabChange} />}
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
