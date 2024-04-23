import React from 'react';
import { Layout, Row, Col } from 'antd';
import { selectLangDirection } from '@/redux/translate/selectors';
import { useSelector } from 'react-redux';
import { Content } from 'antd/lib/layout/layout';
import SelectLanguage from '@/components/SelectLanguage';
export default function AuthLayout({ sideContent, children }) {
  const langDirection = useSelector(selectLangDirection)

  return (
    <Layout style={{ textAlign: langDirection === "rtl" ? "right" : "left",direction:langDirection}}>
      <Content
          style={{
            padding: '10px 20px'
          }}

        >
          <SelectLanguage />
        </Content>
        <Row>
          <Col
            xs={{ span: 0, order: 2 }}
            sm={{ span: 0, order: 2 }}
            md={{ span: 11, order: 1 }}
            lg={{ span: 12, order: 1 }}
            style={{
              minHeight: '100vh',
            }}
          >
            {sideContent}
          </Col>
          <Col
            xs={{ span: 24, order: 1 }}
            sm={{ span: 24, order: 1 }}
            md={{ span: 13, order: 2 }}
            lg={{ span: 12, order: 2 }}
            style={{ background: '#FFF', minHeight: '100vh' }}
          >
            {children}
          </Col>
        </Row>
      

    </Layout>
  );
}
