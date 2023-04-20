import { useState, useEffect } from 'react';
import { Menu, Tabs } from 'antd';
import { SettingsLayout } from '@/layout';

import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';

const RightMenu = ({ handleTabChange }) => {
  const menuItems = [
    { key: 'generalSettings', label: 'generalSettings' },
    { key: 'paymentSettings', label: 'paymentSettings' },
    { key: 'invoiceSettings', label: 'invoiceSettings' },
  ];

  return (
    <Menu mode="inline" defaultSelectedKeys={['generalSettings']}>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} onClick={() => handleTabChange(item.key)}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

const Visibility = ({ isVisible = false, children }) => {
  const show = isVisible ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return <div style={show}>{children}</div>;
};

export default function Settings() {
  const initialState = [
    { tab: 'generalSettings', isActive: true },
    { tab: 'paymentSettings', isActive: false },
    { tab: 'invoiceSettings', isActive: false },
  ];
  const [state, setState] = useState(initialState);

  const isActive = (tab) => {
    const currentTab = state.find((x) => x.tab === tab);
    return currentTab && currentTab.isActive ? true : false;
  };

  const handleTabChange = (tab) => {
    const myNewList = [...state];
    myNewList.map((a) => {
      if (a.tab === tab) {
        a.isActive = true;
      } else {
        a.isActive = false;
      }
    });

    setState(myNewList);
  };

  return (
    <SettingsLayout
      topCardContent="Generals Settings"
      topCardTitle="Settings"
      bottomCardContent={<RightMenu handleTabChange={handleTabChange} />}
    >
      <Visibility isVisible={isActive('generalSettings') || true}>
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
