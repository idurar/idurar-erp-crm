import React from 'react';

import { Layout } from 'antd';
import { Divider, Row, Col } from 'antd';

const { Content } = Layout;

const TopCard = ({ title, cardContent }) => {
  return (
    <div
      className="whiteBox shadow"
      style={{ color: '#595959', fontSize: 13, height: '106px', marginBottom: '24px' }}
    >
      <div className="pad15 strong" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <h3 style={{ color: '#22075e', marginBottom: 0 }}>{title}</h3>
      </div>
      <Divider style={{ padding: 0, margin: 0 }}></Divider>
      <div className="pad15" style={{ textAlign: 'center', justifyContent: 'center' }}>
        {cardContent}
      </div>
    </div>
  );
};

export default function SettingsLayout({
  children,
  topCardTitle,
  topCardContent,
  bottomCardContent,
}) {
  return (
    <Layout className="site-layout">
      <Content
        style={{
          padding: '30px 40px',
          margin: '70px auto',
          width: '100%',
          maxWidth: '1100px',
        }}
      >
        <Row gutter={[24, 24]}>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 17 }}
            lg={{ span: 18 }}
          >
            <div className="whiteBox shadow" style={{ minHeight: '480px' }}>
              <Row className="pad10" gutter={[0, 0]}>
                {children}
              </Row>
            </div>
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 7 }}
            lg={{ span: 6 }}
          >
            <TopCard title={topCardTitle} cardContent={topCardContent} />
            <div className="whiteBox shadow" style={{ minHeight: '280px' }}>
              <Row gutter={[0, 0]}>{bottomCardContent}</Row>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
