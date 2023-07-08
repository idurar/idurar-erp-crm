import React from 'react';

import { Layout } from 'antd';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
  return (
    <Layout className="site-layout">
      <Content
        style={{
          padding: '1rem',
          margin: '4rem auto',
          width: '100%',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}
