import {
  SettingOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  DollarOutlined,
} from '@ant-design/icons';

import { Tabs, Row, Col } from 'antd';
import AppSettings from './AppSettings';
import GeneralSettings from './GeneralSettings';
import PaymentSettings from './PaymentSettings';
import InvoiceSettings from './InvoiceSettings';
import MoneyFormatSettings from './MoneyFormatSettings';

import useLanguage from '@/locale/useLanguage';

const TopCard = () => {
  const translate = useLanguage();
  return (
    <div
      className="whiteBox shadow"
      style={{
        color: '#595959',
        fontSize: 13,
        height: '70px',
        minHeight: 'auto',
        marginBottom: '24px',
      }}
    >
      <div className="pad20 strong" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#22075e', marginBottom: 0, marginTop: 0 }}>{translate('Settings')}</h2>
      </div>
    </div>
  );
};

const RightMenu = ({ children }) => {
  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 24 }}
      md={{ span: 7 }}
      lg={{ span: 6 }}
      order={1}
    >
      <TopCard />
      <div className="whiteBox shadow" style={{ minHeight: '260px' }}>
        <div className="pad25" style={{ width: '100%', paddingBottom: 0 }}>
          {children}
        </div>
      </div>
    </Col>
  );
};

const renderTabBar = (props, DefaultTabBar) => (
  <RightMenu>
    <DefaultTabBar {...props} />
  </RightMenu>
);

const SettingsLayout = ({ children }) => {
  return (
    <Col order={0}>
      <div className="whiteBox shadow" style={{ minHeight: '480px' }}>
        <div className="pad40">{children}</div>
      </div>
    </Col>
  );
};

export default function Settings() {
  const translate = useLanguage();
  const items = [
    {
      key: 'generalSettings',
      label: (
        <>
          <SettingOutlined /> <span>{translate('General Settings')}</span>
        </>
      ),
      children: (
        <SettingsLayout>
          <GeneralSettings />
        </SettingsLayout>
      ),
    },
    {
      key: 'appSettings',
      label: (
        <>
          <FileTextOutlined /> <span>{translate('App Settings')}</span>
        </>
      ),
      children: (
        <SettingsLayout>
          <AppSettings />
        </SettingsLayout>
      ),
    },
    {
      key: 'moneyFormatSettings',
      label: (
        <>
          <DollarOutlined /> <span>{translate('Currency Settings')}</span>
        </>
      ),
      children: (
        <SettingsLayout>
          <MoneyFormatSettings />
        </SettingsLayout>
      ),
    },
    {
      key: 'paymentSettings',
      label: (
        <>
          <CreditCardOutlined /> <span>{translate('Finance Settings')}</span>
        </>
      ),
      children: (
        <SettingsLayout>
          <PaymentSettings />
        </SettingsLayout>
      ),
    },
    {
      key: 'invoiceSettings',
      label: (
        <>
          <FileTextOutlined /> <span>{translate('Crm Settings')}</span>
        </>
      ),
      children: (
        <SettingsLayout>
          <InvoiceSettings />
        </SettingsLayout>
      ),
    },
  ];

  return (
    <Row gutter={[24, 24]}>
      <Tabs tabPosition="right" hideAdd={true} items={items} renderTabBar={renderTabBar} />
    </Row>
  );
}
