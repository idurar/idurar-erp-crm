import {
  SettingOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  DollarOutlined,
} from '@ant-design/icons';

import TabsContent from '@/components/TabsContent/TabsContent';

import AppSettings from './AppSettings';
import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';
import MoneyFormatSettings from './MoneyFormatSettings';

import useLanguage from '@/locale/useLanguage';

export default function Settings() {
  const translate = useLanguage();
  const content = [
    {
      label: translate('General Settings'),
      icon: <SettingOutlined />,
      children: <GeneralSettings />,
    },
    {
      label: translate('App Settings'),
      icon: <FileTextOutlined />,
      children: <AppSettings />,
    },
    {
      label: translate('Currency Settings'),
      icon: <DollarOutlined />,
      children: <MoneyFormatSettings />,
    },
    {
      label: translate('Finance Settings'),
      icon: <CreditCardOutlined />,
      children: <PaymentSettings />,
    },
    {
      label: translate('Crm Settings'),
      icon: <FileTextOutlined />,
      children: <InvoiceSettings />,
    },
  ];

  const pageTitle = translate('Settings');

  return <TabsContent content={content} pageTitle={pageTitle} />;
}
