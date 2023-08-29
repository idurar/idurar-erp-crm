import { Col, Divider, Row, Typography } from 'antd';

const { Title, Text } = Typography;

export default function SetingsSection({ title, description, children }) {
  return (
    <Row gutter={[24, 24]}>
      <Col md={{ span: 24 }} lg={{ span: 12 }}>
        <Title level={4}>{title}</Title>
        <Text type="secondary">{description}</Text>
      </Col>

      <Col md={{ span: 24 }} lg={{ span: 12 }}>
        {children}
      </Col>
      <Divider></Divider>
    </Row>
  );
}
