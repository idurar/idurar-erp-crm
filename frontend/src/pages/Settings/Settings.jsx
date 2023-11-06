import { useState } from 'react';
import { Menu } from 'antd';
import {SettingOutlined, FileTextOutlined, CreditCardOutlined, DollarOutlined} from '@ant-design/icons';
import { SettingsLayout } from '@/layout';
import Visibility from '@/components/Visibility';

import AppSettings from './AppSettings';
import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';
import MoneyFormatSettings from './MoneyFormatSettings';

import useLanguage from '@/locale/useLanguage';

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
  const translate = useLanguage();
  const items = [
    {
      key: 'generalSettings',
      label: (
        <span onClick={() => handleTabChange('generalSettings')}>
          {translate('General Settings')}
        </span>
      ),
      icon: <SettingOutlined />,
    },
    {
      key: 'appSettings',
      label: (
        <span onClick={() => handleTabChange('appSettings')}>{translate('App Settings')}</span>
      ),
      icon: <SettingOutlined />,
    },
    {
      key: 'moneyFormatSettings',
      label: (
        <span onClick={() => handleTabChange('moneyFormatSettings')}>
          {translate('Currency Settings')}
        </span>
      ),
      icon: <DollarOutlined />,
    },
    {
      key: 'paymentSettings',
      label: (
        <span onClick={() => handleTabChange('paymentSettings')}>
          {translate('Finance Settings')}
        </span>
      ),
      icon: <CreditCardOutlined />,
    },
    {
      key: 'invoiceSettings',
      label: (
        <span onClick={() => handleTabChange('invoiceSettings')}>{translate('Crm Settings')}</span>
      ),
      icon: <FileTextOutlined />,
    },
  ];
  const [tabKey, setTabKey] = useState(items[0].key);
  const [tabTitle, setTabTitle] = useState(items[0].label);

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
      topCardTitle={translate('Settings')}
      bottomCardContent={<RightMenu activeTab={tabKey} items={items} />}
    >
      {settingsArray.map((setting, index) => (
        <Visibility key={items[index].key + index} isOpen={isActive(items[index].key)}>
          {setting}
        </Visibility>
      ))}
    </SettingsLayout>
  );
}
