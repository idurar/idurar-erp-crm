import React from 'react';

import ErpContextLayout from '../ErpContextLayout';

import { Layout } from 'antd';

const { Content } = Layout;

export default function ErpLayout({ children, config }) {
  return (
    <ErpContextLayout>
      <Layout className="site-layout">
        <Content
          className="whiteBox shadow layoutPadding"
          style={{
            margin: '100px auto',
            width: '100%',
            maxWidth: '1100px',
            minHeight: '600px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </ErpContextLayout>
  );
}
