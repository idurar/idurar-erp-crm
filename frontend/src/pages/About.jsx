import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { CustomerServiceOutlined, GlobalOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';

const About = () => {
  const supportEmail = 'hi@wiedesign.at';
  const ticketUrl = `mailto:${supportEmail}?subject=${encodeURIComponent('Support-Ticket ERP')}&body=${encodeURIComponent('Bitte beschreiben Sie Ihr Anliegen:\n\nBetrieb:\nAnsprechperson:\nTelefon:\nDringlichkeit:\n\nBeschreibung:')}`;

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px' }}>
      <Card
        bordered={false}
        style={{
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #01200F 0%, #205435 65%, #3E885B 100%)',
          color: '#fff',
          boxShadow: '0 18px 50px rgba(1, 32, 15, 0.18)',
        }}
      >
        <Row gutter={[32, 28]} align="middle">
          <Col xs={24} md={15}>
            <Space direction="vertical" size={12}>
              <CustomerServiceOutlined style={{ color: '#DCF763', fontSize: 42 }} />
              <Typography.Title level={2} style={{ color: '#fff', margin: 0 }}>
                WIEdesign Support
              </Typography.Title>
              <Typography.Paragraph style={{ color: 'rgba(255,255,255,.82)', fontSize: 16 }}>
                Sie benötigen Hilfe mit dem ERP? Senden Sie uns ein Support-Ticket mit einer kurzen
                Beschreibung. Wir melden uns so rasch wie möglich bei Ihnen.
              </Typography.Paragraph>
              <Button
                size="large"
                icon={<SendOutlined />}
                href={ticketUrl}
                style={{ background: '#DCF763', borderColor: '#DCF763', color: '#01200F', fontWeight: 700 }}
              >
                Ticket anfordern
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={9}>
            <Card style={{ background: 'rgba(255,255,255,.96)', border: 0 }}>
              <Space direction="vertical" size="large">
                <Space align="start">
                  <MailOutlined style={{ color: '#205435', fontSize: 20 }} />
                  <div>
                    <Typography.Text type="secondary">Support-Mail</Typography.Text>
                    <br />
                    <Typography.Link href={`mailto:${supportEmail}`}>{supportEmail}</Typography.Link>
                  </div>
                </Space>
                <Space align="start">
                  <GlobalOutlined style={{ color: '#205435', fontSize: 20 }} />
                  <div>
                    <Typography.Text type="secondary">Website</Typography.Text>
                    <br />
                    <Typography.Link href="https://www.wiedesign.at" target="_blank" rel="noreferrer">
                      www.wiedesign.at
                    </Typography.Link>
                  </div>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default About;
