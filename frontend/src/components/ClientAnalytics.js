import { Card, Row, Col } from 'antd';
import { Pie, Column, Line } from '@ant-design/plots';

export default function ClientAnalytics({ data }) {
  // Sample chart data - replace with real data
  const statusData = [
    { type: 'Active', value: 65 },
    { type: 'Inactive', value: 15 },
    { type: 'Pending', value: 20 },
  ];

  const growthData = [
    { month: 'Jan', clients: 100 },
    { month: 'Feb', clients: 120 },
    { month: 'Mar', clients: 150 },
    { month: 'Apr', clients: 180 },
  ];

  return (
    <Row gutter={[16, 16]} className="analytics-charts">
      <Col xs={24} lg={8}>
        <Card title="Client Status Distribution">
          <Pie
            data={statusData}
            angleField="value"
            colorField="type"
            radius={0.8}
            label={{ type: 'outer' }}
          />
        </Card>
      </Col>
      <Col xs={24} lg={16}>
        <Card title="Client Growth">
          <Column
            data={growthData}
            xField="month"
            yField="clients"
            color="#1890ff"
          />
        </Card>
      </Col>
    </Row>
  );
}