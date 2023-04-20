import { useState, useEffect } from 'react';
import { Menu, Tabs } from 'antd';
import { SettingsLayout } from '@/layout';

import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';

const RightMenu = ({ tabOnChange }) => {
  const menuItems = [
    { key: 'generalSettings', label: 'generalSettings' },
    { key: 'paymentSettings', label: 'paymentSettings' },
    { key: 'invoiceSettings', label: 'invoiceSettings' },
  ];

  return (
    <Menu mode="inline" defaultSelectedKeys={['generalSettings']}>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} onClick={() => tabOnChange(item.key)}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

const Visibility = ({ isVisible, children }) => {
  const show = isVisible ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return <div style={show}>{children}</div>;
};

export default function Settings() {
  const [state, setSate] = useState([
    { tab: 'generalSettings', isActive: true },
    { tab: 'paymentSettings', isActive: false },
    { tab: 'invoiceSettings', isActive: false },
  ]);

  const isActive = (tab) => {
    const currentTab = state.find((x) => x.tab === tab);
    return currentTab && currentTab.isActive ? true : false;
  };

  const tabOnChange = (tab) => {
    const myNewList = [...state];
    myNewList.map((a) => {
      if (a.tab === tab) {
        a.isActive = true;
      } else {
        a.isActive = false;
      }
    });

    setSate(myNewList);
  };
  return (
    <SettingsLayout
      topCardContent="Generals Settings"
      topCardTitle="Settings"
      bottomCardContent={<RightMenu tabOnChange={tabOnChange} />}
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
