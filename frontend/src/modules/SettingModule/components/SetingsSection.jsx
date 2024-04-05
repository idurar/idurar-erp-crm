import { selectLangDirection } from '@/redux/translate/selectors';
import { Col, Divider, Row, Typography } from 'antd';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

export default function SetingsSection({ title, description, children }) {
  const langDirection=useSelector(selectLangDirection)

  return (
    <Row gutter={[24, 24]} style={{direction:langDirection}}>
      <Col span={24}>
        <Title level={4}>{title}</Title>
        <Text type="secondary">{description}</Text>
      </Col>

      <Col
        xl={{ span: 18, offset: 2 }}
        lg={{ span: 24 }}
        md={{ span: 24 }}
        sm={{ span: 24 }}
        xs={{ span: 24 }}
      >
        {children}
      </Col>
      <Divider />
    </Row>
  );
}
