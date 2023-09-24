import { Col, Divider, Row, Typography } from 'antd';

const { Title, Text } = Typography;

export default function SetingsSection({ title, description, children }) {
  return (
    <Row gutter={[24, 24]}>
      <Col lg={{ span: 24 }}>
        <Title level={4}>{title}</Title>
        <Text type="secondary">{description}</Text>
      </Col>

      <Col lg={{ span: 18, offset: 1 }}>{children}</Col>
      <Divider></Divider>
    </Row>
  );
}
