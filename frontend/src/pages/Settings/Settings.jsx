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
        <div onClick={() => handleTabChange('generalSettings')}>
        <SettingOutlined />
        <span>  {translate('General Settings')}</span>
      </div>
      ),
    },
    {
      key: 'appSettings',
      label: (
        <div onClick={() => handleTabChange('appSettings')}>
        <SettingOutlined />
        <span>{translate('App Settings')}</span>
      </div>
      ),
    },
    {
      key: 'moneyFormatSettings',
      label: (
        <div onClick={() => handleTabChange('moneyFormatSettings')}>
          <DollarOutlined />
         <span>{translate('Currency Settings')}</span> 
        </div>
      ),
    },
    {
      key: 'paymentSettings',
      label: (
        <div onClick={() => handleTabChange('paymentSettings')}>
          <CreditCardOutlined />
          <span>{translate('Finance Settings')}</span>
        </div>
      ),
    },
    {
      key: 'invoiceSettings',
      label: (
        <div onClick={() => handleTabChange('invoiceSettings')}>
          <FileTextOutlined />
      <span>{translate('Crm Settings')}</span>    
        </div>
      ),
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
