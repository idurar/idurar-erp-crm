import React from 'react';

import { Layout } from 'antd';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
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
        {children}
      </Content>
    </Layout>
  );
}
