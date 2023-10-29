import { useState } from 'react';
import { Menu } from 'antd';
import { SettingOutlined, FileTextOutlined, CreditCardOutlined } from '@ant-design/icons';
import { SettingsLayout } from '@/layout';
import Visibility from '@/components/Visibility';

import AppSettings from './AppSettings';
import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';
import MoneyFormatSettings from './MoneyFormatSettings';

const settingsArray = [
  <GeneralSettings />,
  <AppSettings />,
  <MoneyFormatSettings />,
  <PaymentSettings />,
  <InvoiceSettings />,
];

const RightMenu = ({ activeTab, items }) => {
  return (
    <div className="pad20" style={{ width: '100%' }}>
      <Menu
        mode={'vertical'}
        selectedKeys={[activeTab]}
        items={items}
        style={{ width: '100%' }}
      ></Menu>
    </div>
  );
};

export default function Settings() {
  const items = [
    {
      key: 'generalSettings',
      label: <span onClick={() => handleTabChange('generalSettings')}>General Settings</span>,
      icon: <SettingOutlined />,
    },
    {
      key: 'appSettings',
      label: <span onClick={() => handleTabChange('appSettings')}>App Settings</span>,
      icon: <SettingOutlined />,
    },
    {
      key: 'moneyFormatSettings',
      label: <span onClick={() => handleTabChange('moneyFormatSettings')}>Currency Settings</span>,
      icon: <SettingOutlined />,
    },
    {
      key: 'paymentSettings',
      label: <span onClick={() => handleTabChange('paymentSettings')}>Payment Settings</span>,
      icon: <CreditCardOutlined />,
    },
    {
      key: 'invoiceSettings',
      label: <span onClick={() => handleTabChange('invoiceSettings')}>Invoice Settings</span>,
      icon: <FileTextOutlined />,
    },
  ];
  const [tabKey, setTabKey] = useState(items[0].key);
  const [tabTitle, setTabTitle] = useState(items[0].label);

  const settinsBlock = ({ isActive }) =>
    settingsArray.map((setting, index) => (
      <Visibility key={items[index].key + index} isOpen={isActive(items[index].key)}>
        {setting}
      </Visibility>
    ));

  const isActive = (tab) => {
    return tabKey === tab ? true : false;
  };

  const handleTabChange = (tab) => {
    const menuItem = items.find((item) => item.key === tab);
    setTabTitle(menuItem.label);
    setTabKey(tab);
  };

  return (
    <SettingsLayout
      topCardContent={tabTitle}
      topCardTitle={'Settings'}
      bottomCardContent={<RightMenu activeTab={tabKey} items={items} />}
    >
      {settinsBlock({ isActive })}
    </SettingsLayout>
  );
}
