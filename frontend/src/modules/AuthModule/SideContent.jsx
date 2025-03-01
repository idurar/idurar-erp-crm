import { Space, Layout, Divider, Typography } from 'antd';
import logo from '@/style/images/idurar-crm-erp.svg';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        <img
          src={logo}
          alt="IDURAR ERP CRM"
          style={{ margin: '0 0 40px', display: 'block' }}
          height={63}
          width={220}
        />

        <Title level={1} style={{ fontSize: 28 }}>
          Free Open Source ERP / CRM
        </Title>
        <Text>
          Accounting / Invoicing / Quote App <b /> based on Node.js React.js Ant Design
        </Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
