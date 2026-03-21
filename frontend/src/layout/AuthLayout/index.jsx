import React from 'react';
import { Layout, Row, Col } from 'antd';

// Keep using your existing export signature
export default function AuthLayout({ sideContent, children }) {
  return (
    <Layout className="auth-layout" style={{ minHeight: '100vh' }}>
      {/* container centers the whole auth area and limits max width on very large screens */}
      <div className="auth-container">
        <Row
          gutter={[48, 24]}
          style={{
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
        >
          {/* Side content (logo / hero) */}
          <Col
            xs={{ span: 0, order: 2 }}
            sm={{ span: 0, order: 2 }}
            md={{ span: 11, order: 1 }}
            lg={{ span: 12, order: 1 }}
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
            className="auth-side"
          >
            <div style={{ width: '100%' }}>
              {sideContent}
            </div>
          </Col>

          {/* Form / children */}
          <Col
            xs={{ span: 24, order: 1 }}
            sm={{ span: 24, order: 1 }}
            md={{ span: 13, order: 2 }}
            lg={{ span: 12, order: 2 }}
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
          >
            {/* auth-box keeps the form narrow so inputs don't stretch across huge screens */}
            <div className="auth-box">
              {children}
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
