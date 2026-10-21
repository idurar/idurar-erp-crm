import { Layout, Typography } from 'antd';
import logo from '@/style/images/wiepilot-logo.png';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
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
          alt="WIEpilot"
          style={{ margin: '0 0 40px', display: 'block', maxWidth: '100%', height: 'auto' }}
          width={260}
        />

        <Title level={1} style={{ fontSize: 28 }}>
          WIEpilot ERP CRM
        </Title>
        <Text>Rechnungen, Angebote, Kunden und Warenwirtschaft an einem Ort.</Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
